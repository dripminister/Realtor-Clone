import { BrowserRouter, Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import ForgotPassword from "./pages/ForgotPassword"
import Home from "./pages/Home"
import Offers from "./pages/Offers"
import Profile from "./pages/Profile"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import PrivateRoute from "./components/PrivateRoute"
import CreateListings from "./pages/CreateListings"
import EditListing from "./pages/EditListing"
import Listing from "./pages/Listing"
import Rent from "./pages/Rent"
import Sale from "./pages/Sale"

function App() {
	return (
		<>
			<BrowserRouter>
				<Header />
				<Routes>
					<Route
						path="/"
						element={<Home />}
					/>
					<Route
						path="/category/rent"
						element={<Rent />}
					/>
					<Route
						path="/category/sale"
						element={<Sale />}
					/>
					<Route
						path="/profile"
						element={<PrivateRoute />}
					>
						<Route
							path="/profile"
							element={<Profile />}
						/>
					</Route>
					<Route
						path="/createListings"
						element={<PrivateRoute />}
					>
						<Route
							path="/createListings"
							element={<CreateListings />}
						/>
					</Route>
					<Route
						path="/editListing/:listingId"
						element={<PrivateRoute />}
					>
						<Route
							path="/editListing/:listingId"
							element={<EditListing />}
						/>
					</Route>
					<Route
						path="/offers"
						element={<Offers />}
					/>
					<Route
						path="/category/:categoryName/:listingId"
						element={<Listing />}
					/>
					<Route
						path="/signIn"
						element={<SignIn />}
					/>
					<Route
						path="/signUp"
						element={<SignUp />}
					/>
					<Route
						path="/forgotPassword"
						element={<ForgotPassword />}
					/>
				</Routes>
			</BrowserRouter>
			<ToastContainer
				position="bottom-center"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="dark"
			/>
		</>
	)
}

export default App
