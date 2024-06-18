import axios from 'axios'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'

const SignUp = () => {
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [address, setAddress] = useState('')

  const navigate = useNavigate()

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSingup = async () => {
    const formData = new FormData()
    formData.append('username', username)
    formData.append('email', email)
    formData.append('password', password)
    formData.append('address', address)
    if (image) {
      formData.append('avatar', image)
    }

    try {
      const response = await axios.post(
        'http://localhost:4040/api/v1/users/register',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      console.log(response)
      const { message, statusCode, sucess, data } = response.data
      if (statusCode < 400 && sucess) {
        toast.success(message)
        navigate('/login')
      } else {
        toast.error(message)
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error in Singup'
      toast.error(errorMessage)
    }
  }

  return (
    <div className="h-auto  bg-zinc-900 px-12 py-8 flex items-center justify-center">
      <div className="bg-zinc-800 rounded-lg px-8 py-5 w-full md:w-3/6 lg:w-2/6">
        <p className="text-zinc-200 text-xl">Sign Up</p>
        {imagePreview && (
          <div className="mt-4 flex justify-center">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-24 h-24 rounded-full"
            />
          </div>
        )}
        <div className="mt-4">
          <div>
            <label htmlFor="" className="text-zinc-400">
              Username
            </label>
            <input
              type="text"
              className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
              placeholder="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
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
            <label htmlFor="" className="text-zinc-400">
              Address
            </label>
            <textarea
              className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
              placeholder="address"
              name="address"
              rows="5"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="mt-4">
            <label htmlFor="" className="text-zinc-400">
              Upload Image
            </label>
            <input
              type="file"
              className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>

          <div className="mt-4">
            <button
              className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-700"
              onClick={handleSingup}
            >
              SignUp
            </button>
          </div>
          <p className="flex mt-4 items-center justify-center text-zinc-200 font-semibold">
            Or
          </p>
          <p className="flex mt-4 items-center justify-center text-zinc-500 font-semibold">
            Already have an account? &nbsp;
            <Link
              to={'/login'}
              className="md:hover:text-blue-500 text-white md:text-zinc-500"
            >
              <u>LogIn</u>
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp
