import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import FinishRide from '../components/FinishRide'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const CaptainRiding = ({
  setConfirmRidePopupPanel,
  setRidePopupPanel
}) => {

  const [finishRidePanel, setfinishRidePanel] = useState(false)
  const [ride, setRide] = useState(null)

  const finishRidePanelRef = useRef(null)

  useEffect(() => {
    const stored = localStorage.getItem('captainRide')
    if (stored) {
      try {
        setRide(JSON.parse(stored))
      } catch (err) {
        console.log('Failed to parse ride data:', err)
      }
    }
  }, [])

  // GSAP POPUP ANIMATION
  useGSAP(() => {

    if (finishRidePanel) {

      gsap.to(finishRidePanelRef.current, {
        y: 0,
        duration: 0.5,
        ease: "power2.out"
      })

    } else {

      gsap.to(finishRidePanelRef.current, {
        y: '100%',
        duration: 0.5,
        ease: "power2.in"
      })

    }

  }, [finishRidePanel])

  return (

    <div className='h-screen w-full relative overflow-hidden'>

      {/* MAP */}
      <img
        className='h-full w-full object-cover absolute top-0 left-0'
        src='https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif'
        alt='map'
      />

      {/* HEADER */}
      <div className='absolute top-0 left-0 w-full flex justify-between items-center p-6 z-20'>

        {/* LOGO */}
        <img
          className='w-16'
          src='https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png'
          alt='logo'
        />

        {/* LOGOUT BUTTON */}
        <Link
          to='/captain-login'
          className='h-10 w-10 bg-white shadow-lg flex items-center justify-center rounded-full'
        >
          <i className="ri-logout-box-line text-lg font-bold"></i>
        </Link>

      </div>

      {/* COMPLETE RIDE PANEL */}
      <div
        onClick={() => setfinishRidePanel(true)}
        className='absolute bottom-0 left-0 right-0 bg-yellow-400 px-5 py-4 flex items-center justify-between z-30 rounded-t-3xl cursor-pointer shadow-2xl'
      >

        {/* UP ARROW */}
        <div className='absolute top-1 left-1/2 -translate-x-1/2'>
          <i className='ri-arrow-up-wide-line text-2xl text-black'></i>
        </div>

        {/* USER AND DISTANCE */}
        <div className='flex flex-col'>
          <h4 className='text-lg font-semibold'>
            {ride?.user?.fullname
              ? `${ride.user.fullname.firstname || ''} ${ride.user.fullname.lastname || ''}`.trim()
              : 'Passenger'}
          </h4>
          <p className='text-sm text-gray-700'>
            {ride?.pickup || 'Pickup Location'} → {ride?.destination || 'Destination'}
          </p>
        </div>

        {/* BUTTON */}
        <div className='text-right'>
          <p className='text-sm text-gray-700'>Fare</p>
          <h4 className='text-lg font-semibold'>₹{ride?.fare ?? 0}</h4>
        </div>
      </div>

      {/* FINISH RIDE POPUP */}
      <div
        ref={finishRidePanelRef}
        className='fixed bottom-0 left-0 w-full z-40 bg-white px-3 py-10 pt-12 rounded-t-3xl shadow-2xl'
        style={{ transform: 'translateY(100%)' }}
      >

        {/* CLOSE BUTTON */}
        <h5
          onClick={() => setfinishRidePanel(false)}
          className='absolute top-2 left-0 w-full text-center cursor-pointer'
        >
          <i className='ri-arrow-down-wide-line text-3xl text-gray-400'></i>
        </h5>

        {/* FINISH RIDE COMPONENT */}
        <FinishRide
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          setRidePopupPanel={setRidePopupPanel}
        />

      </div>

    </div>

  )
}

export default CaptainRiding