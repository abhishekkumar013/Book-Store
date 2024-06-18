// import './App.css'

import { Footer } from './components/Footer/Footer'
import Navbar from './components/Navbar/Navbar'
import AllBooks from './pages/AllBooks'
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Cart from './pages/Cart'
import Profile from './pages/Profile'
import ViewBookDetails from './components/ViewBookDetails/ViewBookDetails'

import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { login } from './store/auth'
import Favourites from './components/Profile/Favourites'
import UserOrderHistory from './components/Profile/UserOrderHistory'
import UserProfileSetting from './components/Profile/UserProfileSetting'
import AllOrders from './pages/AllOrders'
import AddBook from './pages/AddBook'
import UpdateBook from './pages/UpdateBook'

function App() {
  const dispatch = useDispatch()
  const role = useSelector((state) => state.auth.user.role)
  useEffect(() => {
    // Fetch user authentication data from localStorage on component mount
    const user = localStorage.getItem('user')
    const accesstoken = localStorage.getItem('accessToken')

    if (user && accesstoken) {
      try {
        const parsedUser = JSON.parse(user)
        dispatch(login({ user: parsedUser, accesstoken }))
      } catch (error) {
        console.error('Error parsing user data from localStorage', error)
      }
    }
  }, [])

  return (
    <div>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/all-books" element={<AllBooks />} />
        <Route exact path="/cart" element={<Cart />} />
        <Route exact path="/profile" element={<Profile />}>
          {role === 'user' ? (
            <Route index element={<Favourites />} />
          ) : (
            <Route index element={<AllOrders />} />
          )}

          {role === 'admin' && <Route path="add-book" element={<AddBook />} />}
          <Route path="orderHistory" element={<UserOrderHistory />} />
          <Route path="settings" element={<UserProfileSetting />} />
        </Route>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<SignUp />} />
        <Route exact path="/updateBook/:id" element={<UpdateBook />} />
        <Route
          exact
          path="/view-book-details/:bookId"
          element={<ViewBookDetails />}
        />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
