import React, { useState } from "react"
import Slider from "../components/Slider"
import { useEffect } from "react"
import {
	collection,
	query,
	orderBy,
	limit,
	getDocs,
	where,
} from "firebase/firestore"
import { db } from "../firebase"
import ListingItem from "../components/ListingItem"
import { Link } from "react-router-dom"

export default function Home() {
	const [offerListings, setOfferListings] = useState(null)
  const [rentListings, setRentListings] = useState(null)
  const [saleListings, setSaleListings] = useState(null)

	useEffect(() => {
		const getData = async () => {
			try {
				const listingsRef = collection(db, "listings")
				const q = query(
					listingsRef,
					where("offer", "==", true),
					orderBy("timestamp", "desc"),
					limit(4)
				)
				const docSnap = await getDocs(q)
				setOfferListings(
					docSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
				)
			} catch (error) {
				console.log(error)
			}
		}

		getData()
	}, [])

  useEffect(() => {
		const getData = async () => {
			try {
				const listingsRef = collection(db, "listings")
				const q = query(
					listingsRef,
					where("type", "==", "rent"),
					orderBy("timestamp", "desc"),
					limit(4)
				)
				const docSnap = await getDocs(q)
				setRentListings(
					docSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
				)
			} catch (error) {
				console.log(error)
			}
		}

		getData()
	}, [])

  useEffect(() => {
		const getData = async () => {
			try {
				const listingsRef = collection(db, "listings")
				const q = query(
					listingsRef,
					where("type", "==", "sale"),
					orderBy("timestamp", "desc"),
					limit(4)
				)
				const docSnap = await getDocs(q)
				setSaleListings(
					docSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
				)
			} catch (error) {
				console.log(error)
			}
		}

		getData()
	}, [])

	return (
		<div>
			<Slider />
			<div className="max-w-6xl mx-auto p-4 space-y-6">
				{offerListings && offerListings.length > 0 && (
					<div className="m-2 mb-6">
						<h2 className="px-3 text-2xl mt-6 font-semibold">Recent Offers</h2>
						<Link to="/offers">
							<p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
								Show more offers
							</p>
						</Link>
						<ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{offerListings.map((listing) => (
								<ListingItem
									key={listing.id}
									id={listing.id}
									listing={listing}
								/>
							))}
						</ul>
					</div>
				)}
			</div>
			<div className="max-w-6xl mx-auto p-4 space-y-6">
				{rentListings && rentListings.length > 0 && (
					<div className="m-2 mb-6">
						<h2 className="px-3 text-2xl mt-6 font-semibold">Places for rent</h2>
						<Link to="/category/rent">
							<p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
								Show more places for rent
							</p>
						</Link>
						<ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{rentListings.map((listing) => (
								<ListingItem
									key={listing.id}
									id={listing.id}
									listing={listing}
								/>
							))}
						</ul>
					</div>
				)}
			</div>
			<div className="max-w-6xl mx-auto p-4 space-y-6">
				{saleListings && saleListings.length > 0 && (
					<div className="m-2 mb-6">
						<h2 className="px-3 text-2xl mt-6 font-semibold">Places to buy</h2>
						<Link to="/category/sale">
							<p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
								Show more places to buy
							</p>
						</Link>
						<ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{saleListings.map((listing) => (
								<ListingItem
									key={listing.id}
									id={listing.id}
									listing={listing}
								/>
							))}
						</ul>
					</div>
				)}
			</div>
		</div>
	)
}
