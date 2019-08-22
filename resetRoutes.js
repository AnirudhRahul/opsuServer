const express = require('express')
const userController = require('./controllers/userController.js')
const router = express.Router()

router.route('/user/requestReset')
  //Requests a password reset through email
  .post(userController.request_reset);

router.route('/user/reset')
  //Returns the html for the password reset page
  .get(userController.request_page)
  //Actually resets the password
  .post(userController.reset_password);

router.route('/user/rejectReset')
    //Rejects the users current reset key
    .get(userController.reject_reset)

module.exports = router
