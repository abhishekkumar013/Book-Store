import express from 'express'
import { verifyJwt } from '../middleware/auth.middleware.js'
import {
  RemmoveFromCartConroller,
  addtocartController,
  getUserCartController,
} from '../controller/cart.controller.js'

const router = express.Router()

router.use(verifyJwt)
router.route('/add-to-cart').patch(addtocartController)
router.route('/remove-from-cart').patch(RemmoveFromCartConroller)
router.route('/get-userCart').get(getUserCartController)

export default router
