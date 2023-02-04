import React, { useState } from "react"
import { useEffect } from "react"
import { db } from "../firebase"
import { doc, getDoc } from "firebase/firestore"
import { toast } from "react-toastify"

export default function ContactLandlord({ userRef, listing }) {
	const [landlord, setLandlord] = useState(null)

	const [message, setMessage] = useState("")

	useEffect(() => {
		const fetchData = async () => {
			const docRef = doc(db, "users", userRef)
			const docSnap = await getDoc(docRef)
			if (docSnap.exists()) {
				setLandlord(docSnap.data())
			} else {
				toast.error("Couldn't get the Landlord data! ")
			}
		}

		fetchData()
	}, [userRef])

	return (
		<>
			{landlord != null && (
				<div className="flex flex-col w-full">
					<p className="">
						Contact {landlord.name} for the {listing.name.toLowerCase()}
					</p>
					<div>
						<textarea
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							className="mt-3 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out"
						></textarea>
						<a
							href={`mailto:${landlord.email}?Subject=${listing.name}&Body=${message}`}
						>
							<button className="mt-3 px-7 py-3 bg-blue-600 text-white font-medium text-sm rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg w-full transition duration-150">
								SEND MESSAGE
							</button>
						</a>
					</div>
				</div>
			)}
		</>
	)
}
