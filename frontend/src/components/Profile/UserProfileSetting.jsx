import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../Loader/Loader'
import axios from 'axios'
import toast from 'react-hot-toast'
import { updateUser } from '../../store/auth'

const UserProfileSetting = () => {
  const user = useSelector((state) => state.auth.user)
  const [value, setValue] = useState({ address: user?.address })
  const dispatch = useDispatch()

  useEffect(() => {
    if (user) {
      setValue({ address: user.address })
    }
  }, [user])

  const handleAddressChange = (e) => {
    const { name, value } = e.target
    setValue((prevValue) => ({ ...prevValue, [name]: value }))
  }

  const handleUpdate = async () => {
    try {
      const response = await axios.patch(
        'http://localhost:4040/api/v1/users/update-address',
        { address: value.address },
        { withCredentials: true },
      )
      const { statusCode, sucess, message, data } = response.data

      if (statusCode < 400 && sucess) {
        toast.success(message)

        // Update user info in localStorage
        let existingUserData = localStorage.getItem('user')

        if (existingUserData) {
          existingUserData = JSON.parse(existingUserData)
          existingUserData.address = data.address // ensure this is correct
          localStorage.setItem('user', JSON.stringify(existingUserData))
        } else {
          localStorage.setItem('user', JSON.stringify(data))
        }

        // Update Redux state
        dispatch(updateUser(data))

        // Update local state
        setValue({ address: data.address })
      } else {
        toast.error(message)
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Error in Address Updattion'
      toast.error(errorMessage)
    }
  }

  return (
    <>
      {!user && (
        <div className="w-full h-[100%] flex items-center justify-center">
          <Loader />
        </div>
      )}
      {user && (
        <div className="h-[100%] p-0 md:p-4 text-zinc-100">
          <h1 className="text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">
            Settings
          </h1>
          <div className="flex gap-12">
            <div className="">
              <label htmlFor="">Username</label>
              <p className="p-2 rounded bg-zinc-800 mt-2 font-semibold">
                {user.username}
              </p>
            </div>
            <div className="">
              <label htmlFor="">Email</label>
              <p className="p-2 rounded bg-zinc-800 mt-2 font-semibold">
                {user.email}
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-col">
            <label htmlFor="">Address</label>
            <textarea
              className="p-2 rounded bg-zinc-800 mt-2 font-semibold"
              rows="5"
              placeholder="Address"
              name="address"
              value={value.address}
              onChange={handleAddressChange}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <button
              className="bg-yellow-500 text-zinc-900 font-semibold px-3 py-2 rounded hover:bg-yellow-400 transition-all duration-300"
              onClick={handleUpdate}
            >
              Update
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default UserProfileSetting
