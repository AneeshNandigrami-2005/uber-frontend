import React, { useContext, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'

const UserProtectWrapper = ({ children }) => {
  const token = localStorage.getItem('token')
  const { setUser } = useContext(UserDataContext)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      setIsLoading(false)
      return
    }

    axios
      .get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setUser(response.data)
        }
        setIsLoading(false)
      })
      .catch((err) => {
        console.log('User profile load failed:', err)
        localStorage.removeItem('token')
        setIsLoading(false)
      })
  }, [token, setUser])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!token) {
    return <Navigate to="/login" />
  }

  return <>{children}</>
}

export default UserProtectWrapper