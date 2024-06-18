import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Loader from '../Loader/Loader'
import { GrLanguage } from 'react-icons/gr'
import { useDispatch, useSelector } from 'react-redux'
import { FaCartShopping, FaHeart } from 'react-icons/fa6'
import { FaEdit } from 'react-icons/fa'
import { MdDeleteOutline } from 'react-icons/md'
import toast from 'react-hot-toast'
import { removeFromCart } from '../../store/cart'

const ViewBookDetails = () => {
  const { bookId } = useParams()
  const [books, setBooks] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)
  const user = useSelector((state) => state.auth.user)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    setIsLoading(true)
    const fetchBookDeatis = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4040/api/v1/admin/get-book-details/${bookId}`,
          { withCredentials: true },
        )
        console.log(response.data)
        const { statusCode, data, message } = response.data

        if (statusCode < 400) {
          setBooks(data)
          setIsLoading(false)
          // toast.success(message);
          console.log(message)
        } else {
          // toast.error(message);
          console.log(message)
        }
        setIsLoading(false)
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message
        // toast.error(`Error fetching recent books: ${errorMessage}`);
        // setIsLoading(false)
        console.log(errorMessage)
      }
    }
    fetchBookDeatis()
  }, [])

  const AddToFav = async () => {
    try {
      const response = await axios.patch(
        'http://localhost:4040/api/v1/users/add-favourite',
        { bookId },
        { withCredentials: true },
      )

      const { message, statusCode, sucess } = response.data
      if (sucess && statusCode < 400) {
        toast.success(message)
      } else {
        toast.error(message)
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Error adding to favourites'
      console.log(error.response.data)
      toast.error(errorMessage)
    }
  }
  const handleAddtoCart = async (req, res) => {
    try {
      const response = await axios.patch(
        'http://localhost:4040/api/v1/cart/add-to-cart',
        { bookId },
        { withCredentials: true },
      )

      const { message, statusCode, sucess } = response.data
      if (sucess && statusCode < 400) {
        toast.success(message)
      } else {
        toast.error(message)
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Error adding to Cart'
      toast.error(errorMessage)
    }
  }

  const handleDeleteBook = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:4040/api/v1/admin/delete-book/${bookId}`,
        { withCredentials: true },
      )
      const { message, data, statusCode, sucess } = response.data
      if (statusCode < 400 && sucess) {
        toast.success(message)
        const itemId = bookId
        dispatch(removeFromCart(itemId))
        navigate('/all-books')
      } else {
        toast.success(message)
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Error Deleting Book'
      toast.error(errorMessage)
    }
  }
  if (isLoading) {
    return (
      <div className="h-[88vh] bg-zinc-900 flex items-center justify-center">
        <Loader />
      </div>
    )
  }
  return (
    <div className="px-4 md:px-12 py-8  bg-zinc-900 flex flex-col lg:flex-row gap-8 items-center">
      <div className="w-full lg:w-3/6">
        <div className="flex flex-col lg:flex-row justify-around bg-zinc-800 p-12 rounded gap-0 lg:gap-8">
          <img
            src={books.bookImg}
            alt={`${books.title} cover`}
            className="h-[50vh] mdd:h-[60vh] lg:h-[65vh] rounded"
          />
          {isLoggedIn && user.role === 'user' && (
            <div className="flex flex-col md:flex-row lg:flex-col items-center justify-between lg:justify-start mt-8 lg:mt-0">
              <button
                className="bg-white rounded lg:rounded-full text-4xl lg:text-3xl p-3 text-red-500 flex items-center justify-center"
                onClick={AddToFav}
              >
                <FaHeart />
                <span className="ms-4 block lg:hidden">Favourites</span>
              </button>
              <button
                className="bg-blue-500 rounded lg:rounded-full mt-8 md:mt-0 lg:mt-8 text-4xl lg:text-3xl p-3 text-white flex items-center justify-center"
                onClick={handleAddtoCart}
              >
                <FaCartShopping />
                <span className="ms-4 block lg:hidden">Add to cart</span>
              </button>
            </div>
          )}
          {isLoggedIn && user.role === 'admin' && (
            <div className="flex flex-col md:flex-row lg:flex-col items-center justify-between lg:justify-start mt-8 lg:mt-0">
              <Link
                to={`/UpdateBook/${bookId}`}
                state={{ bookDetails: books }}
                className="bg-white rounded lg:rounded-full text-4xl lg:text-3xl p-3 text-red-500 flex items-center justify-center"
              >
                <FaEdit />
                <span className="ms-4 block lg:hidden">Edit</span>
              </Link>
              <button
                onClick={handleDeleteBook}
                className="bg-blue-500 rounded lg:rounded-full mt-8 md:mt-0 lg:mt-8 text-4xl lg:text-3xl p-3 text-white flex items-center justify-center"
              >
                <MdDeleteOutline />
                <span className="ms-4 block lg:hidden">Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="p-4 w-full lg:w-3/6">
        <h1 className="text-4xl  text-zinc-300 font-semibold">{books.title}</h1>
        <p className="mt-1 text-zinc-400 ">by {books.author}</p>
        <p className=" text-zinc-500 mt-4 text-xl ">{books.desc}</p>

        <p className="flex mt-4 items-center justify-start text-zinc-400 ">
          <GrLanguage className="me-3" />
          {books.language}
        </p>

        <p className="mt-4 text-zinc-100 font-semibold text-3xl">
          Price : ₹ {books.price}
        </p>
      </div>
    </div>
  )
}

export default ViewBookDetails
