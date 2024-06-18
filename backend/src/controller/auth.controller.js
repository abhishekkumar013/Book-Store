import { Book } from '../models/book.model.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiRespnse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'

export const AddBookController = asyncHandler(async (req, res) => {
  const { title, author, price, desc, language } = req.body

  if (
    [title, author, price, desc, language].some(
      (field) => !field || field.trim() === '',
    )
  ) {
    throw new ApiError(400, 'All fields are required')
  }
  const bookImgLocalpath = req.file?.path
  if (!bookImgLocalpath) {
    throw new ApiError(400, 'Book Image is Required')
  }
  const bookImg = await uploadOnCloudinary(bookImgLocalpath)
  if (!bookImg || !bookImg?.url) {
    throw new ApiError(400, 'Error while uploading on Image')
  }

  const book = await Book.create({
    title,
    author,
    price,
    desc,
    language,
    bookImg: bookImg?.url || '',
  })

  if (!book) {
    throw new ApiError(500, 'Something went wrong while adding  the book')
  }
  return res
    .status(200)
    .json(new ApiResponse(200, book, 'Book Added SuccessFully'))
})

export const UpdateBookController = asyncHandler(async (req, res) => {
  const { title, author, desc, price, language } = req.body
  const { bookId } = req.params

  try {
    if (!price) {
      throw new ApiError(400, 'All fields are required')
    }
    if (
      [title, author, desc, language].some(
        (field) => !field || field.trim() === '',
      )
    ) {
      throw new ApiError(400, 'All fields are required')
    }

    const book = await Book.findById(bookId)
    if (!book) {
      throw new ApiError(404, 'Book not found')
    }

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { $set: { title, author, desc, price, language } },
      { new: true },
    )

    if (!updatedBook) {
      throw new ApiError(500, 'Failed to update book')
    }

    res
      .status(200)
      .json(new ApiResponse(200, updatedBook, 'Book updated successfully'))
  } catch (error) {
    console.error('UpdateBookController error:', error)
    res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message))
  }
})

export const deleteBookController = asyncHandler(async (req, res) => {
  const bookId = req.params.bookId

  const book = await Book.findById(bookId)
  if (!book) {
    throw new ApiError(400, 'Inavlid Search')
  }

  await Book.findByIdAndDelete(bookId)

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Book Deleted Successfully'))
})

export const GetAllBookController = asyncHandler(async (req, res) => {
  const books = await Book.find()
  if (!books || !books?.length > 0) {
    throw new ApiError(400, 'No Book Available')
  }
  return res
    .status(200)
    .json(new ApiResponse(200, books, 'All Book Fetched SUccessfully'))
})

export const GetRecentBookController = asyncHandler(async (req, res) => {
  const books = await Book.find().sort({ createdAt: -1 }).limit(4)
  if (!books || !books?.length > 0) {
    throw new ApiError(400, 'No Book Available')
  }
  return res
    .status(200)
    .json(new ApiResponse(200, books, 'All Book Fetched SUccessfully'))
})

export const GetSIngleBookDetailsController = asyncHandler(async (req, res) => {
  const bookId = req.params.bookId

  if (!bookId) {
    throw new ApiError(400, 'Not a Valid Id')
  }
  const book = await Book.findById(bookId)
  return res
    .status(200)
    .json(new ApiResponse(200, book, 'Book Details Fetched Successfully'))
})
