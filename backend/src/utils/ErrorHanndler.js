import { ApiError } from './ApiError.js'

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: err.error,
    })
  }

  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err.message,
  })
}

export default errorHandler
