const express = require('express')
const userController = require('./controllers/userController.js')
const router = express.Router()

router.route('/user')
  .post(userController.add_user)
  .get(userController.get_user);

router.route('/user/friends')
  .get(userController.get_friends);

router.route('/user/friendRequest')
  .get(userController.get_friendRequests)
  .post(userController.create_request)
  .delete(userController.delete_request);

module.exports = router
