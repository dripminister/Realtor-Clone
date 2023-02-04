import { signInWithPopup } from "firebase/auth"
import React from "react"
import { FcGoogle } from "react-icons/fc"
import { useNavigate } from "react-router-dom"
import { auth, db, provider } from "../firebase"
import { toast } from "react-toastify"
import { setDoc, doc, serverTimestamp, getDoc } from "firebase/firestore"

export default function OAuth() {

  const navigate = useNavigate()

	const onGoogleClick = async (e) => {
    e.preventDefault()
    try {
			const res = await signInWithPopup(auth, provider)
      const user = res.user
      const docRef = doc(db, "users", user.uid)
      const docSnap = await getDoc(docRef)
      if(!docSnap.exists()){
        await setDoc(docRef, {
				email: user.email,
				name: user.displayName,
				timestamp: serverTimestamp(),
			})
      }
			navigate("/")
		} catch (error) {
			toast.error("Something went wrong. Try again!")
		}
	}
	return (
		<button
      type="button"
			onClick={onGoogleClick}
			className="flex items-center justify-center w-full bg-red-700 text-white px-7 py-3 rounded text-sm font-medium hover:bg-red-800 active:bg-red-900 shadow-md hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out"
		>
			<FcGoogle className="text-2xl bg-white rounded-full mr-2" /> CONTINUE WITH
			GOOGLE
		</button>
	)
}
