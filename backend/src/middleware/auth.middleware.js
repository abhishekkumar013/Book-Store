import { User } from '../models/user.models.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import Jwt from 'jsonwebtoken'

export const verifyJwt = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header('Authorization')?.replace('Bearer', '')

    if (!token) {
      throw new ApiError(401, 'Unauthorized request')
    }
    const decode = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const user = await User.findById(decode?._id).select('-password ')

    if (!user) {
      throw new ApiError(401, 'Invalid Access Token')
    }

    req.user = user
    next()
  } catch (error) {
    throw new ApiError(401, error?.message || 'Invalid Access Token')
  }
})
