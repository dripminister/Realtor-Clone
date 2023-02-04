import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { auth } from '../firebase'

export default function useAuth() {
    const [loggedIn, setLoggedIn] = useState(false)
    const [checkingStatus, setCheckingStatus] = useState(true)

    useEffect(() => {
        const authentication = auth
        onAuthStateChanged(authentication, (user) => {
            if(user){
                setLoggedIn(true)
            }
            setCheckingStatus(false)
        })
    },[])
  return { loggedIn, checkingStatus}
}
