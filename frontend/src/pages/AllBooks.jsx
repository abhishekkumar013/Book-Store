import React, { useEffect, useState } from 'react'
import Loader from '../components/Loader/Loader'
import BookCard from '../components/BookCard/BookCard'
import axios from 'axios'

const AllBooks = () => {
  const [Books, setBooks] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    const fetchRecentBooks = async () => {
      try {
        const response = await axios.get(
          'http://localhost:4040/api/v1/admin/get-all-books',
        )
        const { statusCode, data, message } = response.data

        console.log(data)

        if (statusCode < 400) {
          setBooks(data)
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
    fetchRecentBooks()
  }, [])
  return (
    <div className="bg-zinc-900 h-auto px-12 py-8">
      <h4 className="text-3xl text-yellow-100">All Books</h4>
      <div className="my-8 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-8">
        {isLoading === true ? (
          <div className="flex items-center justify-center my-8">
            <Loader />
          </div>
        ) : (
          Books &&
          Books.map((book) => (
            <div key={book._id}>
              <BookCard data={book} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AllBooks
