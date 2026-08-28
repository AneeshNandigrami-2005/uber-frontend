import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { CaptainDataContext } from '../context/CaptainContext'

const Captainlogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const { setCaptain } = useContext(CaptainDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()

    const captainData = {
      email,
      password
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/login`,
        captainData
      )

      const data = response.data

      if (response.status === 200 && data?.token) {
        setCaptain(data.captain)
        localStorage.setItem('token', data.token)

        toast.success('Captain Login Successful')

        setEmail('')
        setPassword('')

        setTimeout(() => {
          navigate('/Captain-home')
        }, 1000)
      } else {
        toast.error(data?.message || 'Login Failed')
      }
    } catch (error) {
      console.error(
        'Login Error:',
        error.response?.data?.message || error.message
      )

      toast.error(
        error.response?.data?.message || 'Invalid Email or Password'
      )
    }
  }

  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
      <div>
        <img
          className='w-20 mb-3'
          src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSVCO4w_adxK32rCXFeKq3_NbLcR9b_js14w&s'
          alt='Uber Logo'
        />

        <h2 className='text-2xl font-mono mb-5 text-gray-800 px-5'>
          Login as Captain
        </h2>

        <form onSubmit={submitHandler} className='bg-white p-5 rounded'>
          <h3 className='text-base mb-2 font-medium'>
            Captain Email ID
          </h3>

          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-base'
            type='email'
            placeholder='email@example.com'
          />

          <h3 className='text-base mb-2 font-medium'>
            Enter Password
          </h3>

          <div className='relative mb-7'>
            <input
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='bg-[#eeeeee] rounded px-4 py-2 border w-full pr-12 text-base'
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
            />
            <button
              type='button'
              onClick={() => setShowPassword((prev) => !prev)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'
            >
              <i className={showPassword ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
            </button>
          </div>

          <button
            type='submit'
            className='bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 w-full text-lg'
          >
            Login
          </button>

          <p className='text-center'>
            Join a fleet?{' '}
            <Link
              to='/captain-signup'
              className='text-blue-600'
            >
              Register as a Captain
            </Link>
          </p>
        </form>
      </div>

      <div>
        <Link to='/login'>
          <button className='bg-[#d5622d] flex items-center justify-center text-white font-semibold mb-5 rounded px-4 py-2 w-full text-base'>
            Sign in as User
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Captainlogin