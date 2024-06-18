import { Book } from '../models/book.model.js'
import { User } from '../models/user.models.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiRespnse.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const addtocartController = asyncHandler(async (req, res) => {
  const { bookId } = req.body
  if (!bookId) {
    throw new ApiError(400, 'book id required')
  }
  const isBook = await Book.findById(bookId)

  if (!isBook) {
    throw new ApiError(400, 'No Book From this Id')
  }
  const isuser = await User.findById(req.user._id)
  const isincart = isuser.cart.includes(bookId)
  if (isincart) {
    throw new ApiError(401, 'Book AllReady In Cart')
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $push: { cart: bookId } },
    { new: true },
  )
  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Book Sucessfully Added to cart'))
})

export const RemmoveFromCartConroller = asyncHandler(async (req, res) => {
  const { bookId } = req.body
  if (!bookId) {
    throw new ApiError(400, 'book id required')
  }
  const isBook = await Book.findById(bookId)
  console.log(isBook)
  if (!isBook) {
    throw new ApiError(400, 'No Book From this Id')
  }
  const isuser = await User.findById(req.user._id)
  const isincart = isuser.cart.includes(bookId)
  if (!isincart) {
    throw new ApiError(401, 'Book Not In Cart')
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { cart: bookId } },
    { new: true },
  )
  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Book Sucessfully remove from cart'))
})

/* this getUserCartController return without sorting the cart array */
// export const getUserCartController = asyncHandler(async (req, res) => {
//   const user = await User.aggregate([
//     {
//       $match: {
//         _id: req.user._id,
//       },
//     },
//     {
//       $lookup: {
//         from: 'books',
//         localField: 'cart',
//         foreignField: '_id',
//         as: 'cart',
//       },
//     },

//     {
//       $project: {
//         _id: 0,
//         username: 1,
//         cart: 1,
//       },
//     },
//   ])
//   if (!user || user.length === 0) {
//     throw new ApiError(400, 'No books found in cart')
//   }

//   return res
//     .status(200)
//     .json(new ApiResponse(200, user, 'Cart fetched successfully'))
// })

/* this getUserCartController return after sorting the cart array */
export const getUserCartController = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: req.user._id,
      },
    },
    {
      $unwind: '$cart', // Unwind the cart array to get individual cart items
    },
    {
      $lookup: {
        from: 'books', // The collection to join with
        localField: 'cart', // The field in the user document that contains the book IDs
        foreignField: '_id', // The field in the book document that corresponds to the book IDs in the user's cart
        as: 'cartBookDetails', // The name of the array to add to the user document
      },
    },
    {
      $unwind: '$cartBookDetails', // Unwind the cartBookDetails array to get individual book details
    },
    {
      $sort: { 'cartBookDetails.createdAt': -1 }, // Sort by createdAt in descending order
    },
    {
      $group: {
        _id: '$_id', // Group back to a single document per user
        username: { $first: '$username' }, // Get the username field
        cart: { $push: '$cartBookDetails' }, // Collect all sorted cartBookDetails
      },
    },
    {
      $project: {
        _id: 0, // Exclude the user's _id field
        username: 1, // Include the username field
        cart: 1, // Include the cart array
      },
    },
  ])
  if (!user || user.length === 0) {
    throw new ApiError(401, 'No books found in cart')
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Cart fetched successfully'))
})
