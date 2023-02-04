import { getAuth, onAuthStateChanged } from "firebase/auth"
import React from "react"
import { useState } from "react"
import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { auth } from "../firebase"

export default function Header() {
	const location = useLocation()
	const navigate = useNavigate()
	const auth = getAuth()
	const [authenticated, setAuthenticated] = useState(false)

	function pathMatchRoute(route) {
		if (route === location.pathname) {
			return true
		}
	}

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setAuthenticated(true)
			} else {
				setAuthenticated(false)
			}
		})
	}, [auth])

	return (
		<div className="bg-white border-b shadow-sm sticky top-0 z-10">
			<header className="flex justify-between items-center px-3 max-w-6xl mx-auto">
				<div>
					<img
						src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg"
						alt="logo"
						className="h-5 cursor-pointer"
						onClick={() => navigate("/")}
					/>
				</div>
				<div>
					<ul className="flex space-x-10">
						<li
							className={`py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent cursor-pointer ${
								pathMatchRoute("/") && "text-black border-b-red-500"
							}`}
							onClick={() => navigate("/")}
						>
							Home
						</li>
						<li
							className={`py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent cursor-pointer ${
								pathMatchRoute("/offers") && "text-black border-b-red-500"
							}`}
							onClick={() => navigate("/offers")}
						>
							Offers
						</li>
						{authenticated ? (
							<li
								className={`py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent cursor-pointer ${
									pathMatchRoute("/profile") && "text-black border-b-red-500"
								}`}
								onClick={() => navigate("/profile")}
							>
								Profile
							</li>
						) : (
							<li
								className={`py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent cursor-pointer ${
									pathMatchRoute("/signIn") && "text-black border-b-red-500"
								}`}
								onClick={() => navigate("/signIn")}
							>
								Sign In
							</li>
						)}
					</ul>
				</div>
			</header>
		</div>
	)
}
