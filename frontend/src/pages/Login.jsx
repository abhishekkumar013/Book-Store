import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../store/auth'
import useNotification from '../hooks/use-notification'
import toast from 'react-hot-toast'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const navigate = useNavigate()

  // notofication
  const { NotificationComponent, triggerNotification } = useNotification(
    'top-right',
  )

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        'http://localhost:4040/api/v1/users/login',
        { email, password },
        { withCredentials: true },
      )

      const { statusCode, data, message, sucess } = response.data

      if (statusCode < 400 && sucess) {
        // triggerNotification({
        //   type: 'success',
        //   message: 'Logout Successful',
        //   duration: 3000,
        // })
        toast.success(message)
        localStorage.setItem('accessToken', data.accesstoken)

        // Optionally, you can also store user info
        localStorage.setItem('user', JSON.stringify(data.user))
        const { user, accesstoken } = data
        dispatch(login({ user, accesstoken }))
        navigate('/')
      } else {
        toast.error(message)
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error in Login'
      toast.error(errorMessage)
      // Handle the error (e.g., display a message to the user)
    }
  }
  return (
    <div className="h-auto lg:h-[86vh] bg-zinc-900 px-12 py-8 flex items-center justify-center">
      <div className="bg-zinc-800 rounded-lg px-8 py-5  w-full md:w-3/6 lg:w-2/6">
        <p className="text-zinc-200 text-xl">Login</p>
        <div className="mt-4">
          {/* <div>
            <lebel htmlFor="" className="text-zinc-400">
              Username
            </lebel>
            <input
              type="text"
              className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
              placeholder="username"
              name="password"
              required
            />
          </div> */}
          <div className="mt-4">
            <label htmlFor="" className="text-zinc-400">
              Email
            </label>
            <input
              type="email"
              className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
              placeholder="xyz@example.com"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mt-4">
            <label htmlFor="" className="text-zinc-400">
              Password
            </label>
            <input
              type="password"
              className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
              placeholder="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mt-4">
            <button
              className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-700"
              onClick={handleSubmit}
            >
              Login
            </button>
          </div>
          <p className="flex mt-4 items-center justify-center text-zinc-200 font-semibold">
            Or
          </p>
          <p className="flex mt-4 items-center justify-center text-zinc-500 font-semibold">
            Create an account? &nbsp;
            <Link
              to={'/singup'}
              className=" md:hover:text-blue-500 text-white md:text-zinc-500"
            >
              <u>Singup</u>
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
