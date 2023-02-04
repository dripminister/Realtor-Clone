import { useEffect, useState } from "react"
import { collection, orderBy, query, limit, getDocs } from "firebase/firestore"
import { db } from "../firebase"
import Spinner from "./Spinner"
import { Swiper, SwiperSlide } from "swiper/react"
import SwiperCore, {
	EffectFade,
	Autoplay,
	Navigation,
	Pagination,
} from "swiper"
import "swiper/css/bundle"
import { useNavigate } from "react-router-dom"

export default function Slider() {
	const [listings, setListings] = useState([])
	const [loading, setLoading] = useState(true)

	SwiperCore.use([Autoplay, Navigation, Pagination])
	const navigate = useNavigate()

	useEffect(() => {
		const getData = async () => {
			const listingsRef = collection(db, "listings")
			const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5))
			const docSnap = await getDocs(q)
			setListings(docSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
			setLoading(false)
		}

		getData()
	}, [])

	if (loading) return <Spinner />

	if (listings.length == 0) return <></>

	return (
		listings && (
			<>
				<Swiper
					slidesPerView={1}
					navigation
					pagination={{ type: "progressbar" }}
					effect="fade"
					modules={[EffectFade]}
					autoplay={{ delay: 3000 }}
				>
					{listings.map((listing) => (
						<SwiperSlide
							key={listing.id}
							onClick={() =>
								navigate(`/category/${listing.type}/${listing.id}`)
							}
						>
							<div
								style={{
									background: `url(${listing.imgUrls[0]}) center, no-repeat`,
									backgroundSize: "cover",
								}}
								className="relative w-full h-[300px] overflow-hidden"
							></div>
							<p className="text-[#f1faee] absolute left-1 top-3 font-medium max-w-[90%] bg-[#457b9d] shadow-lg opacity-90 p-2 rounded-br-3xl">
								{listing.name}
							</p>
							<p className="text-[#f1faee] absolute left-1 bottom-1 font-semibold max-w-[90%] bg-[#e63946] shadow-lg opacity-90 p-2 rounded-tr-3xl">
								${listing.discountedPrice ?? listing.regularPrice}
								{listing.type === "rent" && " / month"}
							</p>
						</SwiperSlide>
					))}
				</Swiper>
			</>
		)
	)
}
