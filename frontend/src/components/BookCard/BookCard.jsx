import axios from 'axios'
import React from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

const BookCard = ({ data, Favourites = false }) => {
  const handleRemoveFav = async ({ bookId }) => {
    try {
      const response = await axios.patch(
        'http://localhost:4040/api/v1/users/remove-favourite',
        { bookId },
        {
          withCredentials: true,
        },
      )
      const { data, message, statusCode, sucess } = response.data
      if (sucess && statusCode < 400) {
        toast.success(message)
      } else {
        toast.error(message)
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Error Remove From Favouriate'
      toast.error(errorMessage)
    }
  }
  return (
    <div className="bg-zinc-800 rounded p-4 flex flex-col">
      <Link to={`/view-book-details/${data._id}`}>
        <div className="bg-zinc-800 rounded p-4  flex flex-col">
          <div className="bg-zinc-900 rounded  flex items-center justify-center">
            <img src={data.bookImg} alt="book_img" className="h-[25vh]" />
          </div>
          <h2 className="mt-4 text-xl text-white font-semibold">
            {data.title}
          </h2>
          <p className="mt-2 text-zinc-400 font-semibold">by {data.author}</p>
          <p className="mt-2 text-zinc-200 font-semibold text-xl">
            ₹ {data.price}
          </p>
        </div>
      </Link>
      {Favourites && (
        <button
          className="bg-yellow-100 px-4 py-2 rounded border border-yellow-500 text-yellow-500 mt-4 "
          onClick={() => handleRemoveFav({ bookId: data._id })}
        >
          Remove From Favouriate
        </button>
      )}
    </div>
  )
}

export default BookCard
