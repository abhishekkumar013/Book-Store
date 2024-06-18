import mongoose from 'mongoose'
import { Order } from '../models/order.models.js'
import { User } from '../models/user.models.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiRespnse.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const CreateOrderController = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id // Assuming userId is available in req.user

    // Step 1: Retrieve the user's cart items using aggregation
    const userWithCart = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'books', // Adjust collection name if different
          localField: 'cart',
          foreignField: '_id',
          as: 'cartItems',
        },
      },
      {
        $project: {
          cartItems: 1,
        },
      },
    ]) //->it return uerid and  its cart in which details of book
    // console.log(userWithCart[0].cartItems)
    /*userWithCart*/

    if (!userWithCart.length || !userWithCart[0].cartItems.length) {
      throw new ApiError(400, 'Cart is empty')
    }

    const cartItems = userWithCart[0].cartItems

    // Step 2: Create orders based on cart items
    const orders = await Promise.all(
      cartItems.map(async (book) => {
        const order = new Order({
          user: userId,
          book: book._id,
          status: 'pending', // or any other initial status
        })
        await order.save()
        return order
      }),
    )

    // Step 3: Clear the user's cart
    await User.updateOne(
      { _id: new mongoose.Types.ObjectId(userId) },
      { $set: { cart: [] } },
    )
    // step 4:add all order in cart
    await User.updateOne(
      { _id: new mongoose.Types.ObjectId(userId) },
      { $push: { orders: { $each: orders.map((order) => order._id) } } },
    )

    res
      .status(201)
      .json(new ApiResponse(200, orders, 'Orders created successfully'))
  } catch (error) {
    throw new ApiError(500, 'Internal server Error')
  }
})

export const getAllOrderofUser = asyncHandler(async (req, res) => {
  const userOrders = await User.aggregate([
    {
      $match: { _id: req.user._id },
    },
    {
      $lookup: {
        from: 'orders',
        localField: 'orders',
        foreignField: '_id',
        as: 'orderItems',
      },
    },
    {
      $unwind: '$orderItems',
    },
    {
      $sort: { 'orderItems.createdAt': -1 }, // Sort by createdAt in descending order
    },
    {
      $lookup: {
        from: 'books',
        localField: 'orderItems.book',
        foreignField: '_id',
        as: 'bookDetails',
      },
    },
    {
      $unwind: '$bookDetails',
    },
    {
      $group: {
        _id: '$_id',
        orders: {
          $push: {
            orderId: '$orderItems._id',
            book: '$bookDetails',
            status: '$orderItems.status',
            createdAt: '$orderItems.createdAt',
            updatedAt: '$orderItems.updatedAt',
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        orders: 1,
      },
    },
  ])
  if (!userOrders || userOrders.length == 0) {
    throw new ApiError(404, 'No orders found for the user')
  }
  return res
    .status(200)
    .json(new ApiResponse(200, userOrders, 'orders fetched sucessfully'))
})

export const OrderHistory = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $unwind: '$userDetails',
      },
      {
        $lookup: {
          from: 'books',
          localField: 'book',
          foreignField: '_id',
          as: 'bookDetails',
        },
      },
      {
        $unwind: '$bookDetails',
      },
      {
        $project: {
          _id: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          'userDetails.username': 1,
          'userDetails.email': 1,
          'userDetails.address': 1,
          'bookDetails._id': 1,
          'bookDetails.title': 1,
          'bookDetails.desc': 1,
          'bookDetails.author': 1,
          'bookDetails.price': 1,
          'bookDetails.status': 1,
        },
      },
    ])

    if (!orders || orders.length === 0) {
      throw new ApiError(401, 'No Order History Found')
    }
    return res
      .status(200)
      .json(new ApiResponse(200, orders, 'Order History Fetched'))
  } catch (error) {
    throw new ApiError(500, 'Error in getting Order History')
  }
})

export const UpdateOrderHistory = asyncHandler(async (req, res) => {
  try {
    const { orderId } = req.params
    const { status } = req.body

    if (
      ![
        'pending',
        'Order Placed',
        'Out for delivery',
        'delivered',
        'canceled',
      ].includes(status)
    ) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    const order = await Order.findById(orderId)

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    order.status = status
    await order.save()
    if (!order) {
      throw new ApiError(404, 'Order Not Updated Try Again')
    }
    return res
      .status(200)
      .json(new ApiResponse(200, order, 'Order Status Updated'))
  } catch (error) {
    throw new ApiError(500, 'Error in getting Order History')
  }
})
