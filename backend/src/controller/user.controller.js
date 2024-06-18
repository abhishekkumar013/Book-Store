import { User } from '../models/user.models.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiRespnse.js'
import { Book } from '../models/book.model.js'

const generateAcessToken = async (userId) => {
  const user = await User.findById(userId)
  const token = await user.generateAccesToken()

  return token
}
export const RegisterController = asyncHandler(async (req, res) => {
  try {
    const { username, email, password, address } = req.body

    if (
      [username, email, password, address].some(
        (field) => !field || field.trim() === '',
      )
    ) {
      throw new ApiError(400, 'All fields are required')
    }
    if (/\s/.test(username)) {
      throw new ApiError(400, 'Username must not contain spaces')
    }
    if (username.length < 4) {
      throw new ApiError(400, 'Username must be greater than 4 characters')
    }
    if (password.length <= 5) {
      throw new ApiError(400, 'Password must be greater than 5')
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] })
    if (existingUser) {
      throw new ApiError(409, 'User already exists')
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path
    if (!avatarLocalPath) {
      throw new ApiError(400, 'Avatar file is required')
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const user = await User.create({
      username: username.toLowerCase(),
      email,
      password,
      address,

      avatar: avatar.url,
    })

    const createdUser = await User.findById(user._id).select('-password')
    if (!createdUser) {
      throw new ApiError(
        500,
        'Something went wrong during registration. Please try again.',
      )
    }

    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, 'User registered successfully'))
  } catch (error) {
    console.log(error.message)
    throw new ApiError(400, 'Error In UserRegistration')
  }
})

export const LoginController = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body

  if (!email && !username) {
    throw new ApiError(400, 'All fields are required')
  }

  if (username) {
    if (/\s/.test(username)) {
      throw new ApiError(400, 'Username must not contain spaces')
    }
  }
  if (!password || password.length <= 5) {
    throw new ApiError(400, 'Invalid User Credentails')
  }

  const isuser = await User.findOne({ $or: [{ email }, { username }] })
  if (!isuser) {
    throw new ApiError(404, 'User Not Registered')
  }

  const matchpass = await isuser.ispasswordMatch(password)
  if (!matchpass) {
    throw new ApiError(401, 'Invalid User Credentails')
  }
  const accesstoken = await generateAcessToken(isuser._id)

  const user = await User.findById(isuser._id).select('-password ')
  const options = {
    httpOnly: true,
    secure: true,
  }
  return res.status(200).cookie('accessToken', accesstoken, options).json(
    new ApiResponse(
      200,
      {
        user,
        accesstoken,
      },
      'User Logged In Successfully',
    ),
  )
})

export const getUSerDetailsControler = asyncHandler(async (req, res) => {
  try {
    const users = await User.find()

    if (!users) {
      throw new ApiError(401, 'No User Avaliable')
    }
    return res
      .status(200)
      .json(new ApiResponse(200, { users }, 'User Fetched Successfully'))
  } catch (err) {
    throw new ApiError(500, err?.message || 'Error in Users Fetching')
  }
})

// favouriate controller
export const favouriateController = asyncHandler(async (req, res) => {
  const userId = req.user._id
  const { bookId } = req.body

  if (!bookId) {
    throw new ApiError(400, 'Book Id Required')
  }
  const book = await Book.findById(bookId)
  if (!book) {
    throw new ApiError(400, 'Book Not Available')
  }

  const userD = await User.findById(userId)
  const isfavourite = userD.favourites.includes(bookId)
  if (isfavourite) {
    throw new ApiError(400, 'Book Already in Favouriate')
  }
  const user = await User.findByIdAndUpdate(
    userId,
    { $push: { favourites: bookId } },
    { new: true },
  )
  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Book Added to favourites'))
})
export const RemoveFromfavouriateController = asyncHandler(async (req, res) => {
  const userId = req.user._id
  const { bookId } = req.body
  if (!bookId) {
    throw new ApiError(400, 'Book Id Required')
  }

  const userD = await User.findById(userId)
  const isfavourite = userD.favourites.includes(bookId)
  if (!isfavourite) {
    throw new ApiError(400, 'Book Not Present in Favourites')
  }
  if (isfavourite) {
    await User.findByIdAndUpdate(userId, { $pull: { favourites: bookId } })
  }
  const user = await User.findById(userId)
  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Book Removed from favourites'))
})
export const getAllFavouriteBookController = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: req.user._id,
      },
    },
    {
      $lookup: {
        from: 'books',
        localField: 'favourites',
        foreignField: '_id',
        as: 'favourites',
        pipeline: [
          {
            $project: {
              title: 1,
              author: 1,
              price: 1,
              desc: 1,
              language: 1,
              bookImg: 1,
              read: 1,
            },
          },
        ],
      },
    },
  ])

  if (!user || user.length === 0) {
    return res.status(404).json(new ApiResponse(404, [], 'User not found'))
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].favourites,
        'All favourites Fetched Successfully',
      ),
    )
})

export const UpdateUserAddressController = asyncHandler(async (req, res) => {
  try {
    const { address } = req.body
    if (!address || address.length === 0) {
      throw new ApiError(401, 'Adress Must Required')
    }
    const userupadted = await User.findByIdAndUpdate(
      req.user._id,
      { address: address },
      { new: true, runValidators: true },
    ).select('-password -favourites -cart -orders')

    if (!userupadted) {
      throw new ApiError(404, 'User not found')
    }
    const user = await User.findById(req.user._id).select('-password')
    if (!user) {
      throw new ApiError(404, 'User not found')
    }
    return res
      .status(200)
      .json(new ApiResponse(200, user, 'Address Updated ucccessfully'))
  } catch (error) {
    throw new ApiError(500, 'Error in Adress Updation')
  }
})
