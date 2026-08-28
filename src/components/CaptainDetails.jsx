import React, { useContext } from 'react'
import {CaptainDataContext} from '../context/CaptainContext'
const CaptainDetails = () => {
  const {captain}=useContext(CaptainDataContext)
  return (
    <div>
         <div className='absolute bottom-0 w-full bg-white rounded-t-3xl shadow-xl p-4'>

        {/* DRAG HANDLE */}
        <div className='w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4'></div>

        {/* DRIVER + EARNINGS */}
        <div className='flex justify-between items-center'>

          {/* DRIVER INFO */}
         <div className="flex items-center gap-3">
  
  {/* Captain Image */}
  <img
    className="h-10 w-10 rounded-full object-cover"
    src={
      captain?.vehicle?.photo ||
      'https://cdn.pixabay.com/photo/2022/03/11/06/14/indian-man-7061278_960_720.jpg'
    }
    alt="captain"
  />

  {/* Captain Details */}
  <div>
    <h3 className="text-lg font-semibold text-gray-800 capitalize">
      {`${captain?.fullname?.firstname || 'Captain'} ${captain?.fullname?.lastname || ''}`.trim()}
    </h3>
    <p className="text-sm text-green-600">
      ● Online
    </p>
  </div>

</div>

          {/* EARNINGS */}
          <div className='text-center'>
            <h2 className='text-2xl font-bold text-gray-900'>₹{captain?.earned ?? 0}</h2>
            <p className='text-xs text-gray-500'>Earned</p>
          </div>
        </div>

        {/* STATS BAR */}
        <div className='bg-gray-100 rounded-2xl flex justify-between items-center px-6 py-4 mt-5'>

          {/* TIME */}
          <div className='text-center'>
            <i className="ri-timer-line text-xl mb-1"></i>
            <p className='text-sm font-semibold'>10.2</p>
            <p className='text-xs text-gray-500'>Time</p>
          </div>

          {/* TRIPS */}
          <div className='text-center'>
            <i className="ri-road-map-line text-xl mb-1"></i>
            <p className='text-sm font-semibold'>10.2</p>
            <p className='text-xs text-gray-500'>Trips</p>
          </div>

          {/* SPEED */}
          <div className='text-center'>
            <i className="ri-speed-up-line text-xl mb-1"></i>
            <p className='text-sm font-semibold'>60</p>
            <p className='text-xs text-gray-500'>Speed</p>
          </div>

        </div>

      </div>
    </div>
  )
}

export default CaptainDetails