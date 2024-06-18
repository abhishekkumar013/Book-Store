import express from 'express'
import { verifyJwt } from '../middleware/auth.middleware.js'
import {
  CreateOrderController,
  OrderHistory,
  UpdateOrderHistory,
  getAllOrderofUser,
} from '../controller/order.controller.js'
import isAdmin from '../utils/Admin.js'

const router = express.Router()

router.use(verifyJwt)
router.route('/').post(CreateOrderController)
router.route('/get-all-order').get(getAllOrderofUser)

router.route('/update-status/:orderId').patch(isAdmin, UpdateOrderHistory)
router.route('/get-order-history').get(isAdmin, OrderHistory)

export default router
