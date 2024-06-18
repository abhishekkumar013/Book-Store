import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaArrowRightFromBracket } from 'react-icons/fa6'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../store/auth'
import toast from 'react-hot-toast'

const Sidebar = ({ data }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const role = useSelector((state) => state.auth.user.role)

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
    dispatch(logout())
    toast.success('Logout Successfull')
    navigate('/login')
  }
  return (
    <div className="bg-zinc-800 p-4 rounded  flex flex-col items-center justify-between h-auto lg:h-[100%] md:h-[90%]">
      <div className="flex flex-col items-center justify-center">
        <img
          src={data.avatar}
          alt="profile_img"
          className="h-[12vh] rounded-full"
        />
        <p className="mt-3 text-xl text-zinc-100 font-semibold">
          {data.username}
        </p>
        <p className="mt-1 text-normal text-zinc-300 ">{data.email}</p>
        <div className="w-full mt-4 h-[1px] bg-zinc-500 hidden lg:block"></div>
      </div>
      {role === 'user' && (
        <div className="w-full flex-col items-center justify-center hidden lg:flex">
          <Link
            to="/profile"
            className="w-full py-2 mt-4 text-center hover:bg-zinc-900 rounded transition-all text-zinc-100 font-semibold"
          >
            Favourite
          </Link>
          <Link
            to="/profile/orderHistory"
            className="text-zinc-100 font-semibold w-full py-2 mt-4 text-center hover:bg-zinc-900 rounded transition-all"
          >
            Order History
          </Link>
          <Link
            to="/profile/settings"
            className="text-zinc-100 font-semibold w-full py-2 mt-4 text-center hover:bg-zinc-900 rounded transition-all"
          >
            Settings
          </Link>
        </div>
      )}
      {role === 'admin' && (
        <div className="w-full flex-col items-center justify-center hidden lg:flex">
          <Link
            to="/profile"
            className="w-full py-2 mt-4 text-center hover:bg-zinc-900 rounded transition-all text-zinc-100 font-semibold"
          >
            All Orders
          </Link>
          <Link
            to="/profile/add-book"
            className="text-zinc-100 font-semibold w-full py-2 mt-4 text-center hover:bg-zinc-900 rounded transition-all"
          >
            Add Book
          </Link>
        </div>
      )}
      <button
        className="bg-zinc-900 w-3/6 lg:w-full mt-4 lg:mt-0 text-white font-semibold flex items-center justify-center py-2 rounded hover:bg-white hover:text-zinc-900 transition-all duration-300"
        onClick={handleLogout}
      >
        Logout <FaArrowRightFromBracket className="ms-4" />
      </button>
    </div>
  )
}

export default Sidebar
