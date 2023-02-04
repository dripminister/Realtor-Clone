import React, { useState } from "react"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { db, auth } from "../firebase"
import { doc, getDoc } from "firebase/firestore"
import Spinner from "../components/Spinner"
import { Swiper, SwiperSlide } from "swiper/react"
import SwiperCore, {
	EffectFade,
	Autoplay,
	Navigation,
	Pagination,
} from "swiper"
import "swiper/css/bundle"
import {
	FaShare,
	FaMapMarkerAlt,
	FaBed,
	FaBath,
	FaParking,
	FaChair,
} from "react-icons/fa"
import ContactLandlord from "../components/ContactLandlord"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"

export default function Listing() {
	const { categoryName, listingId } = useParams()
	const [listing, setListing] = useState(null)
	const [loading, setLoading] = useState(true)
	const [shareLinkCopied, setShareLinkCopied] = useState(false)
	SwiperCore.use([Autoplay, Navigation, Pagination])

	const [contactLandlord, setContactLandlord] = useState(false)

	useEffect(() => {
		const fetchListing = async () => {
			const docRef = doc(db, "listings", listingId)
			const docSnap = await getDoc(docRef)
			if (docSnap.exists()) {
				setListing(docSnap.data())
				setLoading(false)
			}
		}

		fetchListing()
	}, [listingId])

	if (loading) return <Spinner />

	return (
		<main>
			<Swiper
				slidesPerView={1}
				navigation
				pagination={{ type: "progressbar" }}
				effect="fade"
				modules={[EffectFade]}
				autoplay={{ delay: 3000 }}
			>
				{listing.imgUrls.map((url, index) => (
					<SwiperSlide key={index}>
						<div
							className="relative w-full overflow-hidden h-[300px]"
							style={{
								background: `url(${url}) center no-repeat`,
								backgroundSize: "cover",
							}}
						></div>
					</SwiperSlide>
				))}
			</Swiper>
			<div
				onClick={() => {
					navigator.clipboard.writeText(window.location.href)
					setShareLinkCopied(true)
					setTimeout(() => setShareLinkCopied(false), 2000)
				}}
				className="fixed top-[13%] right-[3%] z-20 bg-white cursor-pointer rounded-full border-2 border-gray-400 p-3"
			>
				<FaShare className="text-lg text-slate-500" />
			</div>
			{shareLinkCopied && (
				<p className="fixed top-[23%] right-[1%] z-20 font-semibold border-2 border-gray-400 bg-white rounded-md p-2">
					Link copied!
				</p>
			)}
			<div className="flex flex-col md:flex-row max-w-6xl my-4 mx-4 lg:mx-auto p-4 rounded-lg bg-white lg:space-x-5 shadow-lg">
				<div className="w-full">
					<p className="text-2xl font-bold mb-3 text-blue-900">
						{listing.name} - $
						{listing.offer
							? listing.discountedPrice
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
							: listing.regularPrice
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
						{listing.type === "rent" && " / month"}
					</p>
					<p className="flex items-center mt-6 mb-3 font-semibold">
						<FaMapMarkerAlt className="text-green-700 mr-1" /> {listing.address}
					</p>
					<div className="flex justify-start items-center space-x-4 w-[75%]">
						<p className="bg-red-800 text-white w-full max-w-[200px] rounded-md p-1 text-center font-semibold shadow-md">
							{listing.type === "rent" ? "Rent" : "Sale"}
						</p>
						{listing.offer && (
							<p className="bg-green-800 text-white w-full max-w-[200px] rounded-md p-1 text-center font-semibold shadow-md">
								${listing.regularPrice - listing.discountedPrice} discount
							</p>
						)}
					</div>
					<p className="mt-3 mb-3">
						<span className="font-semibold">Description - </span>
						{listing.description}
					</p>
					<ul className="flex space-x-3 items-center text-sm font-semibold mb-6">
						<li className="flex items-center whitespace-nowrap">
							<FaBed className="text-lg mr-1" />
							{listing.bedrooms > 1
								? listing.bedrooms + " Bedrooms"
								: "1 Bedroom"}
						</li>
						<li className="flex items-center whitespace-nowrap">
							<FaBath className="text-lg mr-1" />
							{listing.bathrooms > 1
								? listing.bathrooms + " Bathrooms"
								: "1 Bathroom"}
						</li>
						<li className="flex items-center whitespace-nowrap">
							<FaParking className="text-lg mr-1" />{" "}
							{listing.parkingSpot ? "Parking" : "No parking"}
						</li>
						<li className="flex items-center whitespace-nowrap">
							<FaChair className="text-lg mr-1" />{" "}
							{listing.furnished ? "Furnished" : "Not furnished"}
						</li>
					</ul>
					{listing.userRef != auth?.currentUser.uid && !contactLandlord && (
						<div className="mt-6">
							<button
								className="px-7 py-3 bg-blue-600 text-white font-medium text-sm rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg w-full transition duration-150"
								onClick={() => setContactLandlord(true)}
							>
								CONTACT LANDLORD
							</button>
						</div>
					)}
					{contactLandlord && (
						<ContactLandlord
							userRef={listing.userRef}
							listing={listing}
						/>
					)}
				</div>
				<div className="w-full z-10 overflow-x-hidden mt-6 lg:mt-0 h-[400px]">
					<MapContainer
						center={[listing.geoloc.lat, listing.geoloc.lng]}
						zoom={13}
						scrollWheelZoom={false}
						style={{ height: "100%", width: "100%" }}
					>
						<TileLayer
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						/>
						<Marker position={[listing.geoloc.lat, listing.geoloc.lng]}>
							<Popup>{listing.address}</Popup>
						</Marker>
					</MapContainer>
				</div>
			</div>
		</main>
	)
}
