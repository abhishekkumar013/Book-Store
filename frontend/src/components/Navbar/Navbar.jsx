import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { IoReorderThreeOutline } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'
import { login, logout } from '../../store/auth'
import useNotification from '../../hooks/use-notification'
import toast from 'react-hot-toast'

function Navbar() {
  const cartLength = useSelector((state) => state.cart.cartLength)
  const [isMobileNav, setIsMobileNav] = useState(false)
  const role = useSelector((state) => state.auth.user.role)
  console.log(role)

  const { isLoggedIn, user } = useSelector((state) => state.auth)
  const { NotificationComponent, triggerNotification } = useNotification(
    'top-right',
  )
  const links = [
    {
      title: 'Home',
      link: '/',
    },

    {
      title: 'All Books',
      link: '/all-books',
    },
    {
      title: 'Cart',
      link: '/cart',
    },
  ]

  if (isLoggedIn && role === 'user') {
    links.push({
      title: 'Profile',
      link: '/profile',
      img: user?.avatar, // Assuming user has a profileImage property
    })
  }
  if (isLoggedIn && role === 'admin') {
    links.push({
      title: 'Admin Profile',
      link: '/profile',
      img: user?.avatar, // Assuming user has a profileImage property
    })
  }

  const dispatch = useDispatch()

  const handleLogout = () => {
    // triggerNotification({
    //   type: 'success',
    //   message: 'Logout Successfull',
    //   duration: 3000,
    // })
    toast.success('Logout Successfull')
    setIsMobileNav(false)
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
    dispatch(logout())
  }

  return (
    <>
      <nav className="relative z-50 bg-zinc-800 text-white px-8 py-4 flex items-center justify-between">
        <NavLink to={'/'} className="flex items-center ">
          <img
            className="h-10  me-4"
            src="https://cdn-icons-png.flaticon.com/128/10433/10433049.png"
            alt="logo_img"
          />
          <h1 className="text-2xl font-semibold">BookHeaven</h1>
        </NavLink>
        <div className="nav-links-bookheaven block md:flex items-center gap-4">
          <div className="hidden md:flex gap-4">
            {links.map((link, i) => (
              <NavLink
                to={link.link}
                className="hover:text-blue-500 transition-all duration-300 cursor-pointer"
                key={i}
              >
                {link.img ? (
                  <img
                    src={link.img}
                    alt="profile"
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  link.title
                )}
              </NavLink>
            ))}
          </div>
          <div className="hidden md:flex gap-4">
            {!isLoggedIn ? (
              <>
                <NavLink
                  to={'/login'}
                  className="px-4 py-1 border border-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300"
                >
                  SignIn
                </NavLink>
                <NavLink
                  to={'/signup'}
                  className="px-4 py-1 bg-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300"
                >
                  SignUp
                </NavLink>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="px-4 py-1 border border-red-500 rounded hover:bg-red-500 hover:text-white transition-all duration-300"
              >
                Logout
              </button>
            )}
          </div>
          <button
            onClick={() => setIsMobileNav(!isMobileNav)}
            className="text-white text-4xl block md:hidden hover:text-zinc-400"
          >
            <IoReorderThreeOutline />
          </button>
        </div>
      </nav>
      {isMobileNav && (
        <div className="absolute bg-zinc-800 h-screen top-0 left-0 w-full z-40 flex flex-col items-center justify-center">
          {links.map((link, i) => (
            <NavLink
              onClick={() => setIsMobileNav(false)}
              to={link.link}
              className="hover:text-blue-500 mb-8 text-white text-4xl font-semibold transition-all duration-300 cursor-pointer"
              key={i}
            >
              {link.img ? (
                <img
                  src={link.img}
                  alt="profile"
                  className="h-16 w-16 rounded-full"
                />
              ) : (
                link.title
              )}
            </NavLink>
          ))}
          {!isLoggedIn ? (
            <>
              <NavLink
                onClick={() => setIsMobileNav(false)}
                to={'/login'}
                className="px-8 mb-8 text-3xl font-semibold py-2 text-white border border-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300"
              >
                SignIn
              </NavLink>
              <NavLink
                onClick={() => setIsMobileNav(false)}
                to={'/signup'}
                className="px-8 mb-8 text-3xl font-semibold py-2 text-white bg-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300"
              >
                SignUp
              </NavLink>
            </>
          ) : (
            <button
              onClick={() => {
                setIsMobileNav(false)
                handleLogout()
              }}
              className="px-8 mb-8 text-3xl font-semibold py-2 text-white border border-red-500 rounded hover:bg-red-500 hover:text-white transition-all duration-300"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </>
  )
}

export default Navbar
