import express from 'express'
import { verifyJwt } from '../middleware/auth.middleware.js'
import isAdmin from '../utils/Admin.js'
import {
  AddBookController,
  GetAllBookController,
  GetRecentBookController,
  GetSIngleBookDetailsController,
  UpdateBookController,
  deleteBookController,
} from '../controller/auth.controller.js'
import { upload } from '../middleware/multer.middleware.js'

const router = express.Router()

router
  .route('/add-book')
  .post(upload.single('bookImg'), verifyJwt, isAdmin, AddBookController)

router
  .route('/update-book/:bookId')
  .patch(verifyJwt, isAdmin, UpdateBookController)

router
  .route('/delete-book/:bookId')
  .delete(verifyJwt, isAdmin, deleteBookController)

router.route('/get-all-books').get(GetAllBookController)
router.route('/get-Recent-books').get(GetRecentBookController)
router
  .route('/get-book-details/:bookId')
  .get(verifyJwt, GetSIngleBookDetailsController)

export default router
