import React, { useState, useEffect } from 'react'

import { Route, Routes, useLocation } from 'react-router-dom'

// ToastContainer is provided once in `main.jsx`

import Start from './pages/Start'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import Captainlogin from './pages/Captainlogin'
import CaptainSignup from './pages/CaptainSignup'
import Home from './pages/Home'
import UserProtectWrapper from './pages/UserProtectWrapper'
import UserLogout from './pages/UserLogout'
import CaptainHome from './pages/CaptainHome'
import CaptainProtectWrapper from './pages/CaptainProtectWrapper'
import SplashScreen from './pages/SplashScreen'
import Page1 from './pages/Page1'
import Page2 from './pages/Page2'

import Loader from './components/Loader'

import Riding from './pages/Riding'
import CaptainRiding from './pages/CaptainRiding'
import Payment from './components/Payment'

const App = () => {

  const [showSplash, setShowSplash] = useState(true)

  const [loading, setLoading] = useState(false)

  const location = useLocation()

  // Route Loading
  useEffect(() => {

    setLoading(true)

    const timer = setTimeout(() => {

      setLoading(false)

    }, 500)

    return () => clearTimeout(timer)

  }, [location])

  return (
    <>

      {/* ToastContainer is rendered at the app root (see `main.jsx`) */}

      {/* Loader */}
      {loading && <Loader />}

      {showSplash ? (

        <SplashScreen onFinish={() => setShowSplash(false)} />

      ) : (

        <Routes>

          <Route path="/" element={<Start />} />

          <Route path="/login" element={<UserLogin />} />

          <Route path="/signup" element={<UserSignup />} />

          <Route path="/captain-login" element={<Captainlogin />} />

          <Route path="/captain-signup" element={<CaptainSignup />} />

          <Route path="/page1" element={<Page1 />} />

          <Route path="/page2" element={<Page2 />} />

          <Route path="/riding" element={<Riding />} />

          <Route
            path="/captain-riding"
            element={<CaptainRiding />}
          />

          <Route
            path="/payment"
            element={<Payment />}
          />

          <Route
            path="/home"
            element={
              <UserProtectWrapper>
                <Home />
              </UserProtectWrapper>
            }
          />

          <Route
            path="/user/logout"
            element={
              <UserProtectWrapper>
                <UserLogout />
              </UserProtectWrapper>
            }
          />

          <Route
            path="/Captain-home"
            element={
              <CaptainProtectWrapper>
                <CaptainHome />
              </CaptainProtectWrapper>
            }
          />

        </Routes>

      )}

    </>
  )
}

export default App