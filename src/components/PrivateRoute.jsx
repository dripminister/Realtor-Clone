import React from "react"
import { Navigate, Outlet } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import Spinner from "./Spinner"

export default function PrivateRoute() {
	const {loggedIn, checkingStatus} = useAuth()
    if(checkingStatus) {
        return <Spinner />
    } 
    return loggedIn ? <Outlet /> : <Navigate to="/signIn" />
}
