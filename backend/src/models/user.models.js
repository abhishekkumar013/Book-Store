import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import Jwt from 'jsonwebtoken'

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin'],
    },
    favourites: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Books',
      },
    ],
    cart: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Books',
      },
    ],
    orders: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Books',
      },
    ],
  },
  { timestamps: true },
)

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  // const salt = bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, 10)
  next()
})
UserSchema.methods.ispasswordMatch = async function (password) {
  return await bcrypt.compare(password, this.password)
}
UserSchema.methods.generateAccesToken = function () {
  return Jwt.sign(
    {
      _id: this._id,
      name: this.username,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACESS_TOKEN_EXPIRY,
    },
  )
}

export const User = mongoose.model('User', UserSchema)
