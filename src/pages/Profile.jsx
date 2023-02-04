import { signOut, updateProfile } from "firebase/auth"
import {
	updateDoc,
	doc,
	collection,
	query,
	where,
	orderBy,
	getDocs,
	deleteDoc,
} from "firebase/firestore"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { auth, db } from "../firebase"
import { FcHome } from "react-icons/fc"
import ListingItem from "../components/ListingItem"

export default function Profile() {
	const [name, setName] = useState(auth.currentUser.displayName)
	const [email, setEmail] = useState(auth.currentUser.email)
	const navigate = useNavigate()
	const [changeDetail, setChangeDetail] = useState(false)
	const [listings, setListings] = useState(null)
	const [loading, setLoading] = useState(true)

	const onDelete = async (id) => {
		if(window.confirm('Are you sure you want to delete this listing?')){
			await deleteDoc(doc(db, "listings", id))
			const updatedListings = listings.filter(listing => listing.id !== id)
			setListings(updatedListings)
			toast.success("Successfully deleted the listing!")
		}
	}  

	const onEdit = (id) => {
		navigate(`/editListing/${id}`)
	}

	const onLogOut = async () => {
		await signOut(auth)
		navigate("/")
	}

	const onSubmit = async () => {
		try {
			if (auth.currentUser.displayName !== name) {
				await updateProfile(auth.currentUser, {
					displayName: name,
				})

				const docRef = doc(db, "users", auth.currentUser.uid)
				await updateDoc(docRef, {
					name,
				})
				toast.success("Name changed successfully!")
			}
		} catch (err) {
			toast.error("Something went wrong. Try again!")
		}
	}

	useEffect(() => {
		const collectionRef = collection(db, "listings")

		const fetchListings = async () => {
			const q = query(
				collectionRef,
				where("userRef", "==", auth.currentUser.uid),
				orderBy("timestamp", "desc")
			)
			const querySnap = await getDocs(q)
			let listingsArr = []
			querySnap.forEach((doc) =>
				listingsArr.push({ ...doc.data(), id: doc.id })
			)
			setListings(listingsArr)
			setLoading(false)
		}

		fetchListings()
	}, [])

	return (
		<>
			<section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
				<h1 className="text-3xl text-center mt-6 font-bold">My Profile</h1>
				<div className="w-full md:w-[50%] mt-6 px-3">
					<form>
						<input
							type="text"
							value={name}
							disabled={!changeDetail}
							onChange={(e) => setName(e.target.value)}
							className={`w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out mb-6 ${
								changeDetail && "bg-red-200 focus:bg-red-200"
							}`}
						/>
						<input
							type="email"
							value={email}
							disabled
							className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out mb-6"
						/>
						<div className="flex justify-between whitespace-nowrap text-sm sm:text-base mb-6">
							<p>
								Do you want to change your name?{" "}
								<span
									onClick={() => {
										changeDetail && onSubmit()
										setChangeDetail(!changeDetail)
									}}
									className="text-red-600 hover:text-red-700 transition ease-in-out duration-200 cursor-pointer"
								>
									{changeDetail ? "Apply change" : "Edit"}
								</span>
							</p>
							<p
								onClick={onLogOut}
								className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out cursor-pointer"
							>
								Sign Out
							</p>
						</div>
					</form>

					<button
						type="submit"
						className="w-full bg-blue-600 text-white px-7 py-2 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800"
					>
						<Link
							to="/createListings"
							className="flex items-center justify-center"
						>
							<FcHome className="mr-1 text-3xl bg-red-200 rounded-full p-1 border-2" />
							SELL OR RENT A HOME
						</Link>
					</button>
				</div>
			</section>
			<div className="max-w-6xl px-3 mt-6 mx-auto">
				{!loading && listings.length > 0 && (
					<>
						<h2 className="text-2xl text-center font-semibold mb-6">My Listings</h2>
						<ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-6 mb-6">
							{listings.map((listing) => (
								<ListingItem
									key={listing.id}
									listing={listing}
									id={listing.id}
									onDelete={() => onDelete(listing.id)}
									onEdit={() => onEdit(listing.id)}
								/>
							))}
						</ul>
					</>
				)}
			</div>
		</>
	)
}
