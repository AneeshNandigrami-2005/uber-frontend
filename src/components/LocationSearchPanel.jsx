import React from 'react'

const LocationSearchPanel = ({
    suggestions,
    activeField,
    setPickup,
    setDestination
}) => {

    // ✅ Handle location selection
    const handleSelect = (place) => {

        if (activeField === 'pickup') {
            setPickup(place)
        } else {
            setDestination(place)
        }
    }

    return (

        <div className='space-y-2'>

            {
                suggestions.length > 0 ? (

                    suggestions.map((elem, idx) => {

                        // ✅ Get proper place name from API response
                        const fullPlace =
                            elem.description ||
                            elem.display_name ||
                            elem.name ||
                            elem.address ||
                            elem.placePrediction?.text?.text ||
                            ''

                        // ✅ Show only first 2 parts
                        const placeName = fullPlace
                            .split(',')
                            .slice(0, 2)
                            .join(',')

                        return (

                            <div
                                key={idx}
                                onClick={() => handleSelect(placeName)}
                                className='flex items-center gap-4 border border-gray-200 p-3 rounded-xl cursor-pointer hover:border-black hover:bg-gray-50 transition-all duration-200'
                            >

                                {/* ✅ LOCATION ICON */}
                                <div className='bg-[#eee] h-10 w-10 rounded-full flex items-center justify-center'>

                                    <i className="ri-map-pin-line text-lg"></i>

                                </div>

                                {/* ✅ LOCATION TEXT */}
                                <div>

                                    <h4 className='font-medium text-base'>
                                        {placeName}
                                    </h4>

                                </div>

                            </div>
                        )
                    })

                ) : (

                    <div className='text-center text-gray-400 mt-5'>
                        No locations found
                    </div>
                )
            }

        </div>
    )
}

export default LocationSearchPanel