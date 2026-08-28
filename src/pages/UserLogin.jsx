import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { UserDataContext } from '../context/UserContext'
import axios from 'axios'

const UserLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const { setUser } = useContext(UserDataContext)
  const navigate = useNavigate()

 
  const submitHandler = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        {
          email,
          password
        }
      )

      const data = response.data

      if (response.status === 200 && data?.token) {
        setUser(data.user)
        localStorage.setItem('token', data.token)

        toast.success('Login Successful')

        setTimeout(() => {
          navigate('/home')
        }, 1000)
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Login Failed'
      )
    }
  }

  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
      <div>
        <img
          className='w-20 mb-3'
          src="https://download.logo.wine/logo/Uber/Uber-Logo.wine.png"
          alt="Uber Logo"
        />

        <form onSubmit={submitHandler} className='bg-white p-5 rounded'>
          <h3 className='text-xl mb-2 font-medium'>
            Enter Your Email ID
          </h3>

          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full'
            type="email"
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
              className='bg-[#eeeeee] rounded px-4 py-2 border w-full pr-12'
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
            type="submit"
            className='bg-black text-white font-semibold mb-3 rounded px-4 py-2 w-full'
          >
            Login
          </button>

         

          <p className='text-center'>
            <Link to="/signup" className='text-blue-600'>
              Create new Account
            </Link>
          </p>
        </form>
      </div>

      <div>
        <Link to="/captain-login">
          <button className='bg-[#10b461] text-white font-semibold rounded px-4 py-2 w-full'>
            Sign in as Captain
          </button>
        </Link>
      </div>
    </div>
  )
}

export default UserLogin