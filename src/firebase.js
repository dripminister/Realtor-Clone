import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
	apiKey: "AIzaSyDQCxD2iHgLWyxcsatezbUAR6xOh6g3Law",
	authDomain: "realtor-clone-90e20.firebaseapp.com",
	projectId: "realtor-clone-90e20",
	storageBucket: "realtor-clone-90e20.appspot.com",
	messagingSenderId: "878784693565",
	appId: "1:878784693565:web:13e9c633505b92d9c37154",
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)
export const provider = new GoogleAuthProvider()