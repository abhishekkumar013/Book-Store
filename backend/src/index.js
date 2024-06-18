import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import DbConnnect from './db/db.js'
import errorHandler from './utils/ErrorHanndler.js'

dotenv.config()

// db connnect
DbConnnect()

const app = express()

//
app.use(
  cors({
    origin: 'http://localhost:5173', // Allow requests from this origin
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(cookieParser())

// routes
import UserRoutes from './routes/user.routes.js'
import AdminRoutes from './routes/auth.routes.js'
import CartRoutes from './routes/cart.routes.js'
import OrderRoutes from './routes/order.routes.js'

app.use('/api/v1/users', UserRoutes)
app.use('/api/v1/admin', AdminRoutes)
app.use('/api/v1/cart', CartRoutes)
app.use('/api/v1/order', OrderRoutes)

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`)
})
