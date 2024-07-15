import axios from 'axios'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const AddBook = () => {
  //  title, author, price, desc, language

  const [Data, setData] = useState({
    title: '',
    author: '',
    price: '',
    desc: '',
    language: '',
  })
  const [image, setImage] = useState(null)

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }
  const change = (e) => {
    const { name, value } = e.target
    setData({ ...Data, [name]: value })
  }
  const handleSubmit = async () => {
    const formData = new FormData()
    formData.append('title', Data.title)
    formData.append('author', Data.author)
    formData.append('price', Data.price)
    formData.append('desc', Data.desc)
    formData.append('language', Data.language)
    if (image) {
      formData.append('bookImg', image)
    }
    try {
      const response = await axios.post(
        'http://localhost:4040/api/v1/admin/add-book',
        formData,
        { withCredentials: true },
      )
      const { message, statusCode, sucess, data } = response.data
      if (statusCode < 400 && sucess) {
        toast.success(message)
      } else {
        toast.error(message)
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error Addig Book'
      toast.error(errorMessage)
    }
  }
  return (
    <div className="h-[100%] p-0 md:p-4">
      <h1 className="text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">
        Add Book
      </h1>
      <div className="p-4 bg-zinc-800 rounded">
        <div>
          <label htmlFor="" className="text-zinc-400">
            Image
          </label>
          <input
            type="file"
            className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2  outline-none"
            required
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
        <div className="mt-4">
          <label htmlFor="" className="text-zinc-400">
            Title of book
          </label>
          <input
            type="text"
            className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
            placeholder="title of book"
            name="title"
            value={Data.title}
            onChange={change}
          />
        </div>
        <div className="mt-4">
          <label htmlFor="" className="text-zinc-400">
            Author of book
          </label>
          <input
            type="text"
            className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
            placeholder="title of book"
            name="author"
            value={Data.author}
            onChange={change}
          />
        </div>
        <div className="mt-4 flex gap-4">
          <div className="w-3/6">
            <label htmlFor="" className="text-zinc-400">
              Langugage
            </label>
            <input
              type="text"
              className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
              placeholder="language of book"
              name="language"
              value={Data.language}
              onChange={change}
            />
          </div>
          <div className="w-3/6">
            <label htmlFor="" className="text-zinc-400">
              Price
            </label>
            <input
              type="number"
              className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
              placeholder="Price of book"
              name="price"
              value={Data.price}
              onChange={change}
            />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="" className="text-zinc-400">
            Author of book
          </label>
          <textarea
            type="text"
            className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
            placeholder="desccription of book"
            name="desc"
            rows={5}
            value={Data.desc}
            onChange={change}
          />
        </div>
        <div className="mt-4">
          <button
            onClick={handleSubmit}
            className="p-2 rounded outline-none font-semibold bg-blue-400"
          >
            Add Book
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddBook
