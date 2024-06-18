import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Books',
    },
    status: {
      type: String,
      default: 'pending',
      enum: [
        'pending',
        'Order Placed',
        'Out for delivery',
        'delivered',
        'canceled',
      ],
    },
  },
  { timestamps: true },
)

export const Order = mongoose.model('Order', OrderSchema)
