import { uuidv4 } from "@firebase/util"
import { serverTimestamp, addDoc, collection } from "firebase/firestore"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import Spinner from "../components/Spinner"
import { auth, storage, db } from "../firebase"

export default function CreateListings() {

	const navigate = useNavigate()

	const [geolocation, setGeolocation] = useState(true)
	const [loading, setLoading] = useState(false)
	const [type, setType] = useState("sale")
	const [name, setName] = useState("")
	const [bedrooms, setBedrooms] = useState(1)
	const [bathrooms, setBathrooms] = useState(1)
	const [parkingSpot, setParkingSpot] = useState(false)
	const [furnished, setFurnished] = useState(false)
	const [address, setAddress] = useState("")
	const [description, setDescription] = useState("")
	const [offer, setOffer] = useState(false)
	const [regularPrice, setRegularPrice] = useState(1)
	const [discountedPrice, setDiscountedPrice] = useState(1)
	const [images, setImages] = useState([])
	const [latitude, setLatitude] = useState(0)
	const [longitude, setLongitude] = useState(0)

	const onSubmit = async (e) => {
		e.preventDefault()
		setLoading(true)

		if (offer && +regularPrice <= +discountedPrice) {
			setLoading(false)
			toast.error("Discounted price has to be less than the regular price")
			return
		}
		if (images.length > 6) {
			setLoading(false)
			toast.error("Maximum number of images is 6")
			return
		}

		let geo = {}

		if (geolocation) {
			const res = await fetch(
				`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
			)
			const data = await res.json()
			if (data.status === "ZERO_RESULTS") {
				setLoading(false)
				toast.error("The address was not found!")
				return
			}
			geo.lat = data.results[0]?.geometry.location.lat ?? 0
			geo.lng = data.results[0]?.geometry.location.lng ?? 0
		} else {
			geo.lat = latitude
			geo.lng = longitude
		}

		const imgUrls = await Promise.all(
			[...images].map((img) => storeImage(img))
		).catch((error) => {
			setLoading(false)
			toast.error("Images could not be uploaded")
			return
		})

		const formData = {
			type,
			name,
			bedrooms,
			bathrooms,
			parkingSpot,
			address,
			furnished,
			description,
			offer,
			regularPrice,
			discountedPrice,
			imgUrls,
			timestamp: serverTimestamp(),
			geoloc: geo,
			userRef: auth.currentUser.uid,
		}

		!formData.offer && delete formData.discountedPrice
		const docRef = await addDoc(collection(db, "listings"), formData)
		setLoading(false)
		toast.success("Listing created")
		navigate(`/category/${formData.type}/${docRef.id}`)
	}

	const storeImage = async (img) => {
		return new Promise((resolve, reject) => {
			const filename = `${auth.currentUser.uid}-${img.name}-${uuidv4()}`
			const storageRef = ref(storage, filename)

			const uploadTask = uploadBytesResumable(storageRef, img)

			uploadTask.on(
				"state_changed",
				(snapshot) => {
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100
					console.log("Upload is " + progress + "% done")
					switch (snapshot.state) {
						case "paused":
							console.log("Upload is paused")
							break
						case "running":
							console.log("Upload is running")
							break
					}
				},
				(error) => {
					reject(error)
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						resolve(downloadURL)
					})
				}
			)
		})
	}

	if (loading) return <Spinner />

	return (
		<main className="max-w-md px-2 mx-auto">
			<h1 className="text-3xl text-center mt-6 font-bold">Create a Listing</h1>
			<form onSubmit={onSubmit}>
				<p className="text-lg mt-6 font-semibold ">Sell / Rent</p>
				<div className="flex space-x-3">
					<button
						type="button"
						className={`px-7 py-3 font-medium text-sm shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
							type === "sale"
								? "bg-slate-600 text-white"
								: "bg-white text-black"
						}`}
						onClick={() => setType("sale")}
					>
						SELL
					</button>
					<button
						type="button"
						className={`px-7 py-3 font-medium text-sm shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
							type === "rent"
								? "bg-slate-600 text-white"
								: "bg-white text-black"
						}`}
						onClick={() => setType("rent")}
					>
						RENT
					</button>
				</div>
				<p className="text-lg mt-6 font-semibold">Name</p>
				<input
					type="text"
					onChange={(e) => setName(e.target.value)}
					value={name}
					required
					placeholder="Property Name"
					maxLength="32"
					minLength="10"
					className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
				/>
				<div className="flex space-x-6 justify-start mb-6">
					<div>
						<p className="text-lg font-semibold">Beds</p>
						<input
							type="number"
							min="1"
							max="50"
							required
							value={bedrooms}
							onChange={(e) => setBedrooms(e.target.value)}
							className="w-full text-center px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
						/>
					</div>
					<div>
						<p className="text-lg font-semibold">Baths</p>
						<input
							type="number"
							min="1"
							max="50"
							required
							value={bathrooms}
							onChange={(e) => setBathrooms(e.target.value)}
							className="w-full text-center px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
						/>
					</div>
				</div>
				<p className="text-lg mt-6 font-semibold ">Parking Spot</p>
				<div className="flex space-x-3">
					<button
						type="button"
						className={`px-7 py-3 font-medium text-sm shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
							parkingSpot ? "bg-slate-600 text-white" : "bg-white text-black"
						}`}
						onClick={() => setParkingSpot(true)}
					>
						YES
					</button>
					<button
						type="button"
						className={`px-7 py-3 font-medium text-sm shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
							parkingSpot ? "bg-white text-black" : "bg-slate-600 text-white"
						}`}
						onClick={() => setParkingSpot(false)}
					>
						NO
					</button>
				</div>
				<p className="text-lg mt-6 font-semibold ">Furnished</p>
				<div className="flex space-x-3">
					<button
						type="button"
						className={`px-7 py-3 font-medium text-sm shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
							furnished ? "bg-slate-600 text-white" : "bg-white text-black"
						}`}
						onClick={() => setFurnished(true)}
					>
						YES
					</button>
					<button
						type="button"
						className={`px-7 py-3 font-medium text-sm shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
							furnished ? "bg-white text-black" : "bg-slate-600 text-white"
						}`}
						onClick={() => setFurnished(false)}
					>
						NO
					</button>
				</div>
				<p className="text-lg mt-6 font-semibold">Address</p>
				<textarea
					type="text"
					onChange={(e) => setAddress(e.target.value)}
					value={address}
					placeholder="Address"
					required
					className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
				/>
				{!geolocation && (
					<div className="flex space-x-6 justify-start mb-6">
						<div>
							<p className="text-lg font-semibold">Latitude</p>
							<input
								type="number"
								min="-90"
								max="90"
								value={latitude}
								onChange={(e) => setLatitude(e.target.value)}
								required
								className="w-full text-center px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
							/>
						</div>
						<div>
							<p className="text-lg font-semibold">Longitude</p>
							<input
								type="number"
								min="-180"
								max="180"
								value={longitude}
								onChange={(e) => setLongitude(e.target.value)}
								required
								className="w-full text-center px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
							/>
						</div>
					</div>
				)}
				<p className="text-lg font-semibold">Description</p>
				<textarea
					type="text"
					onChange={(e) => setDescription(e.target.value)}
					value={description}
					required
					placeholder="Description"
					className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
				/>
				<p className="text-lg font-semibold ">Offer</p>
				<div className="flex space-x-3 mb-6">
					<button
						type="button"
						className={`px-7 py-3 font-medium text-sm shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
							offer ? "bg-slate-600 text-white" : "bg-white text-black"
						}`}
						onClick={() => setOffer(true)}
					>
						YES
					</button>
					<button
						type="button"
						className={`px-7 py-3 font-medium text-sm shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
							offer ? "bg-white text-black" : "bg-slate-600 text-white"
						}`}
						onClick={() => setOffer(false)}
					>
						NO
					</button>
				</div>
				<div className="flex items-center mb-6">
					<div>
						<p className="text-lg font-semibold">Regular Price</p>
						<div className="flex w-full justify-center items-center space-x-6">
							<input
								type="number"
								min="1"
								onChange={(e) => setRegularPrice(e.target.value)}
								value={regularPrice}
								required
								className="w-full text-center px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
							/>
							{type === "rent" && (
								<div>
									<p className="text-md w-full whitespace-nowrap">$ / Month</p>
								</div>
							)}
						</div>
					</div>
				</div>
				{offer && (
					<div className="flex items-center mb-6">
						<div>
							<p className="text-lg font-semibold">Discounted Price</p>
							<div className="flex w-full justify-center items-center space-x-6">
								<input
									type="number"
									min="1"
									onChange={(e) => setDiscountedPrice(e.target.value)}
									value={discountedPrice}
									required={offer}
									className="w-full text-center px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
								/>
								{type === "rent" && (
									<div>
										<p className="text-md w-full whitespace-nowrap">
											$ / Month
										</p>
									</div>
								)}
							</div>
						</div>
					</div>
				)}
				<div className="mb-6">
					<p className="text-lg font-semibold">Images</p>
					<p className="text-gray-600">
						The first image will be the cover (max 6).
					</p>
					<input
						type="file"
						multiple
						onChange={(e) => setImages(e.target.files)}
						accept=".jpg,.png,.jpeg,.avif"
						required
						className="w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:border-slate-600"
					/>
				</div>
				<button
					className="mb-6 w-full px-7 py-3 bg-blue-600 text-white font-medium rounded text-sm shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
					type="submit"
				>
					CREATE LISTING
				</button>
			</form>
		</main>
	)
}
