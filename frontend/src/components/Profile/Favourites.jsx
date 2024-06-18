import axios from 'axios'
import React, { useEffect, useState } from 'react'
import BookCard from '../BookCard/BookCard'
import Loading1 from '../Loader/Loading1'

const Favourites = () => {
  const [favbooks, setFavBooks] = useState([])
  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        'http://localhost:4040/api/v1/users/get-all-favourite',
        { withCredentials: true },
      )
      const { data, message, statusCode, sucess } = response.data

      if (sucess && statusCode < 400) {
        setFavBooks(data)
      }
    }
    fetch()
  }, [favbooks])
  if (favbooks.length === 0 || !favbooks) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <Loading1 />
        <div>
          <span className="text-red-500">No Favourite Book</span>
        </div>
      </div>
    )
  }
  return (
    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
      {favbooks &&
        favbooks.map((book) => (
          <div key={book._id}>
            <BookCard data={book} Favourites={true} />
          </div>
        ))}
    </div>
  )
}

export default Favourites
