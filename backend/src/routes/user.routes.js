import express from 'express'
import {
  LoginController,
  RegisterController,
  RemoveFromfavouriateController,
  UpdateUserAddressController,
  favouriateController,
  getAllFavouriteBookController,
  getUSerDetailsControler,
} from '../controller/user.controller.js'
import { upload } from '../middleware/multer.middleware.js'
import isAdmin from '../utils/Admin.js'
import { verifyJwt } from '../middleware/auth.middleware.js'

const router = express.Router()

router.route('/register').post(
  upload.fields([
    {
      name: 'avatar',
      maxCount: 1,
    },
  ]),
  RegisterController,
)
router.route('/login').post(LoginController)

router.route('/user-info').get(verifyJwt, isAdmin, getUSerDetailsControler)

router.route('/update-address').patch(verifyJwt, UpdateUserAddressController)

router.route('/add-favourite').patch(verifyJwt, favouriateController)

router
  .route('/remove-favourite')
  .patch(verifyJwt, RemoveFromfavouriateController)

router.route('/get-all-favourite').get(verifyJwt, getAllFavouriteBookController)

export default router
