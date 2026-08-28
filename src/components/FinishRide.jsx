import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const FinishRide = ({ setFinishRidePopupPanel }) => {

    const navigate = useNavigate()
    const [ride, setRide] = useState(null)

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

    const submitHandler = (e) => {
        e.preventDefault()
        if (!ride) {
            toast.error('Ride data missing')
            return
        }
        navigate('/payment')
    }

    const passengerName = ride?.user?.fullname
        ? typeof ride.user.fullname === 'string'
            ? ride.user.fullname
            : `${ride.user.fullname.firstname || ''} ${ride.user.fullname.lastname || ''}`.trim()
        : 'Passenger'

    const passengerPhoto =
        ride?.user?.profileImage ||
        'https://cdn.pixabay.com/photo/2022/03/11/06/14/indian-man-7061278_960_720.jpg'

    const distanceLabel = ride?.distance ? `${ride.distance} KM` : 'N/A'
    const pickupLocation = ride?.pickup || 'Pickup Location'
    const destinationLocation = ride?.destination || 'Destination'
    const fareAmount = ride?.fare != null ? `₹${ride.fare}` : '₹0.00'

    return (
        <div className='h-full relative bg-white'>
            
            {/* 1. THE DOWN ARROW */}
            <h5 
                onClick={() => setFinishRidePopupPanel(false)}
                className='p-2 text-center w-full absolute top-2 text-gray-400 cursor-pointer z-10'
            >
                <i className="ri-arrow-down-wide-line text-3xl"></i>
            </h5>

            {/* 2. MAIN CONTENT */}
            <div className='p-5 pt-16'>
                <h3 className='text-2xl font-semibold mb-5 text-center'>Finish This Ride</h3>

                {/* PASSENGER CARD */}
                <div className='flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-4 shadow-sm'>
                    <div className='flex items-center gap-3'>
                        <img 
                            className='h-12 w-12 rounded-full object-cover border-2 border-white' 
                            src={passengerPhoto} 
                            alt="passenger" 
                        />
                        <h2 className='text-lg font-medium'>{passengerName}</h2>
                    </div>
                    <h5 className='text-lg font-semibold text-gray-800'>{distanceLabel}</h5>
                </div>

                {/* TRIP DETAILS */}
                <div className='flex flex-col gap-2 w-full mt-5'>
                    <div className='w-full border-b-2 py-3 flex items-center gap-5 text-left'>
                        <i className="ri-map-pin-user-fill text-xl text-gray-700"></i>
                        <div>
                            <h3 className='text-lg font-bold'>{pickupLocation}</h3>
                            <p className='text-sm text-gray-500'>Pickup</p>
                        </div>
                    </div>
                    <div className='w-full border-b-2 py-3 flex items-center gap-5 text-left'>
                        <i className="ri-map-pin-2-fill text-xl text-gray-700"></i>
                        <div>
                            <h3 className='text-lg font-bold'>{destinationLocation}</h3>
                            <p className='text-sm text-gray-500'>Destination</p>
                        </div>
                    </div>
                    <div className='w-full py-3 flex items-center gap-5 text-left'>
                        <i className="ri-money-rupee-circle-line text-xl text-gray-700"></i>
                        <div>
                            <h3 className='text-lg font-bold'>{fareAmount}</h3>
                            <p className='text-sm text-gray-500'>Fare</p>
                        </div>
                    </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className='mt-10 w-full'>
                    <button
                        onClick={submitHandler}
                        className='w-full bg-blue-700 text-white font-semibold p-3 rounded-lg flex justify-center text-lg active:scale-95 transition-transform'
                    >
                        Confirm Payment
                    </button>
                    
                    <p className='text-xs text-black mt-6 text-center bold'>
                        Click on "Confirm Payment" once payment is received.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default FinishRide