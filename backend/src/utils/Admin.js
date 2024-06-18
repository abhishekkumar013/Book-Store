import { ApiError } from '../utils/ApiError.js' // Ensure the correct path to ApiError

const isAdmin = async (req, res, next) => {
  try {
    const user = req.user
    if (!user) {
      throw new ApiError(401, 'Unauthorized: User not found')
    }
    if (user.role !== 'admin') {
      throw new ApiError(401, 'Forbidden: Admin access required')
    }
    next()
  } catch (error) {
    next(error)
  }
}

export default isAdmin
