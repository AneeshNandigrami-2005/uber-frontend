import React from 'react'
import { Link } from 'react-router-dom'

const Riding = () => {  
  return (
    <div className='h-screen'>
        <Link to='/home' className='fixed h-10 w-10 bg-white flex items-center justify-center rounded-full right-2 top-2'>
            <i class="ri-home-4-line"></i>
        </Link>
        <div className='h-1/2 '>
        <img className='h-full w-full'src='https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif'></img>
        </div>
        <div className='h-1/2 p-4'>
        <div className='flex items-center justify-between w-full mt-4'>
        <img 
          className="h-16 object-contain" 
          src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy82ZWU1MGMxYi0yMTc0LTRjOTctODNhMS1iZmQ0NTQ0Njg5ZDAucG5n" 
          alt="Car" 
        />
        <div className='text-right'>
          <h2 className='text-lg font-medium text-gray-600 uppercase'>Aneesh</h2>
          <h4 className='text-2xl font-bold -mt-1'>WB 68B 1245</h4>
          <p className='text-sm text-gray-500'>Swift Dzire White</p>
        </div>
      </div>

      {/* 3. Divider */}
      <div className='w-full h-[1px] bg-gray-200 mt-5'></div>

      {/* 4. Ride Information */}
      <div className="w-full mt-2">
          
          <div className="flex items-center gap-5 p-3 border-b border-gray-100">
            <i className="ri-map-pin-user-fill text-xl text-gray-700"></i>
            <div>
              <h3 className="text-lg font-bold leading-tight">562/11-A</h3>
              <p className="text-sm text-gray-600">Kankariya Talab, Ahmedabad</p>
            </div>
          </div>


          <div className="flex items-center gap-5 p-3">
            <i className="ri-money-rupee-circle-fill text-xl text-gray-700"></i>
            <div>
              <h3 className="text-lg font-bold leading-tight">₹193.20</h3>
              <p className="text-sm text-gray-600">Cash Payment</p>
            </div>
          </div>

      </div>
          <Link className='w-full mt-5 bg-green-600 twxt-white font-semibold p-2 rounded-lg '>Make a Payment </Link>

        </div>
    </div>
  )
}

export default Riding