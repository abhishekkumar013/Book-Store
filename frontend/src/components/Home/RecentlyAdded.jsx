import React, { useEffect, useState } from 'react'
import axios from 'axios'
import BookCard from '../BookCard/BookCard'
import Loader from '../Loader/Loader'

const RecentlyAdded = () => {
  const [recentBooks, setRecentBooks] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    const fetchRecentBooks = async () => {
      try {
        const response = await axios.get(
          'http://localhost:4040/api/v1/admin/get-Recent-books',
        )
        const { statusCode, data, message } = response.data

        if (statusCode < 400) {
          setRecentBooks(data)
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
    <div className="mt-8 px-4 ">
      <h4 className="text-3xl text-yellow-100">Recently Added Books</h4>
      <div className="my-8 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-8">
        {isLoading === true ? (
          <div className="flex items-center justify-center my-8">
            <Loader />
          </div>
        ) : (
          recentBooks &&
          recentBooks.map((book) => (
            <div key={book._id}>
              <BookCard data={book} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default RecentlyAdded
