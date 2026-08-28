import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'

// Firebase



const UserSignup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  // Captcha States
  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)
  const [captchaAnswer, setCaptchaAnswer] = useState('')

  const navigate = useNavigate()

  const { setUser } = useContext(UserDataContext)

  // Generate Random Numbers
  const generateCaptcha = () => {
    const first = Math.floor(Math.random() * 9) + 1
    const second = Math.floor(Math.random() * 9) + 1

    setNum1(first)
    setNum2(second)
    setCaptchaAnswer('')
  }

  useEffect(() => {
    generateCaptcha()
  }, [])

  // Form Submit
  const submitHandler = async (e) => {
    e.preventDefault()

    // Captcha Verification
    if (parseInt(captchaAnswer) !== num1 + num2) {
      toast.error('Wrong captcha answer')
      generateCaptcha()
      return
    }

    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName
      },
      email,
      password
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/register`,
        newUser
      )

      if (response.status === 201) {
        const data = response.data

        setUser(data.user)

        if (data.token) {
          localStorage.setItem('token', data.token)
        }

        toast.success('Signup Successful')

        navigate('/home')
      }

      // Clear Fields
      setFirstName('')
      setLastName('')
      setEmail('')
      setPassword('')
      setCaptchaAnswer('')

      generateCaptcha()
    } catch (error) {
      console.error(error)
      const errors = error.response?.data?.errors
      if (errors && Array.isArray(errors)) {
        errors.forEach((err) => toast.error(err.msg))
      } else {
        const message = error.response?.data?.message || 'Signup failed'
        toast.error(message)
      }
    }
  }



  return (
    <div className="p-5 min-h-screen flex flex-col justify-between bg-gray-100">
      
      {/* Main Content */}
      <div className="max-w-md mx-auto w-full">

        {/* Logo */}
        <img
          className="w-20 mb-2"
          src="https://download.logo.wine/logo/Uber/Uber-Logo.wine.png"
          alt="Uber Logo"
        />

        {/* Form */}
        <form
          onSubmit={submitHandler}
          className="bg-white p-5 rounded-xl shadow-md"
        >
          {/* Name */}
          <h3 className="text-base mb-2 font-medium">
            Enter Your Name
          </h3>

          <div className="flex gap-4 mb-5">
            <input
              required
              className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-base outline-none"
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />

            <input
              required
              className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-base outline-none"
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          {/* Email */}
          <h3 className="text-base mb-2 font-medium">
            Enter Your Email
          </h3>

          <input
            required
            className="bg-[#eeeeee] mb-5 rounded px-4 py-2 border w-full text-base outline-none"
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <h3 className="text-base mb-2 font-medium">
            Enter Password
          </h3>

          <div className='relative mb-5'>
            <input
              required
              className='bg-[#eeeeee] rounded px-4 py-2 border w-full pr-12 text-base outline-none'
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type='button'
              onClick={() => setShowPassword((prev) => !prev)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'
            >
              <i className={showPassword ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
            </button>
          </div>

          {/* Captcha */}
          <div className="bg-gray-100 border rounded-lg p-4 mb-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-red-500">
                Answer The Question
              </h3>

              <button
                type="button"
                onClick={generateCaptcha}
                className="text-sm bg-black text-white px-3 py-1 rounded"
              >
                Refresh
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-black text-white min-w-[100px] text-center px-4 py-2 rounded text-lg font-bold whitespace-nowrap">
                {num1} + {num2}
              </div>

              <input
                required
                type="number"
                placeholder="Answer"
                value={captchaAnswer}
                onChange={(e) => setCaptchaAnswer(e.target.value)}
                className="bg-white border rounded px-4 py-2 w-full outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-black hover:bg-gray-900 transition text-white font-semibold mb-3 rounded px-4 py-3 w-full text-lg"
          >
            Create Account
          </button>

          {/* Login */}
          <p className="text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-medium">
              Login here
            </Link>
          </p>
        </form>
      </div>

     
    </div>
  )
}

export default UserSignup