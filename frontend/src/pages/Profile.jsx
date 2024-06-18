import React, { useEffect } from 'react'
import Sidebar from '../components/Profile/Sidebar'
import { Link, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Loader from '../components/Loader/Loader'
import Loading1 from '../components/Loading/Loading1'
import MobileNav from '../components/Profile/MobileNav'

const Profile = () => {
  const user = useSelector((state) => state.auth.user)
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)

  if (!isLoggedIn) {
    return (
      <div className="bg-zinc-900 px-2 md:px-12 flex flex-col md:flex-row h-screen py-8 gap-8 text-white">
        <div className="w-full h-[100%] flex items-center justify-center">
          <Loading1 />

          <div className="m-4">
            <Link
              to="/login"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:bg-gradient-to-l hover:from-purple-600 hover:to-blue-500"
            >
              Click to login
            </Link>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="bg-zinc-900 px-2  md:px-12 flex flex-col md:flex-row  py-8 gap-4 text-white">
      <div className="w-full md:w-1/6 h-auto lg:h-screen">
        <Sidebar data={user} />
        <MobileNav />
      </div>
      <div className="w-full md:w-5/6">
        <Outlet />
      </div>
    </div>
  )
}

export default Profile
