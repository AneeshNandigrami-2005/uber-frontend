import React from 'react'
import { Link } from 'react-router-dom'

const Start = () => {
  return (
    <div>
      <div
        style={{
          backgroundImage: `url('src/assets/home.png')`
        }}
        className="bg-cover bg-center h-screen pt-8 flex flex-col justify-between w-full"
      >
        {/* Uber Logo */}
        <img
          className='w-16 m-8'
          src="https://download.logo.wine/logo/Uber/Uber-Logo.wine.png"
          alt="Uber Logo"
        />

        {/* Bottom White Box */}
        <div className='bg-white pb-7 py-4 px-4'>
          <h2 className='text-3xl font-bold'>
            Get Started with Uber
          </h2>

          <Link
            to='/login'
            className='flex items-center justify-center w-full bg-black text-white py-3 rounded mt-5'
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Start