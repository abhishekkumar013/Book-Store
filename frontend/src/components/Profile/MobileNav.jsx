import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const MobileNav = () => {
  const role = useSelector((state) => state.auth.user.role)
  return (
    <>
      {role === 'user' && (
        <div className="w-full flex lg:hidden items-center justify-between mt-4">
          <Link
            to="/profile"
            className="w-full  text-center hover:bg-zinc-900 rounded transition-all text-zinc-100 font-semibold"
          >
            Favourite
          </Link>
          <Link
            to="/profile/orderHistory"
            className="text-zinc-100 font-semibold w-full  text-center hover:bg-zinc-900 rounded transition-all"
          >
            Order History
          </Link>
          <Link
            to="/profile/settings"
            className="text-zinc-100 font-semibold w-full  text-center hover:bg-zinc-900 rounded transition-all"
          >
            Settings
          </Link>
        </div>
      )}
      {role === 'admin' && (
        <div className="w-full flex lg:hidden items-center justify-between mt-4">
          <Link
            to="/profile"
            className="w-full  text-center hover:bg-zinc-900 rounded transition-all text-zinc-100 font-semibold"
          >
            All Orders
          </Link>
          <Link
            to="/profile/add-book"
            className="text-zinc-100 font-semibold w-full  text-center hover:bg-zinc-900 rounded transition-all"
          >
            Add Book
          </Link>
        </div>
      )}
    </>
  )
}

export default MobileNav
