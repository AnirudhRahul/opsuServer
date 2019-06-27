const express = require('express')
const beatmapController = require('./controllers/beatmapController.js')
const userController = require('./controllers/userController.js')
const adminController = require('./controllers/adminController.js')
const router = express.Router()

router.route('/user')
  .post(userController.add_user)
  .get(userController.get_user);

router.route('/user/requestReset')
  //Requests a password reset through email
  .post(userController.request_reset);

router.route('/user/reset')
  //Returns the html for the password reset page
  .get(userController.request_page)
  //Actually resets the password
  .post(userController.reset_password);

router.route('/user/friends')
  .get(userController.get_friends);

router.route('/user/friendRequest')
  .get(userController.get_friendRequests)
  .post(userController.create_request)
  .delete(userController.delete_request);

router.route('/leaderboard')
  .get(beatmapController.get_leaderboard)
  .post(beatmapController.add_to_leaderboard);

router.route('/admin/user')
  .get(adminController.get_all_users);

router.route('/admin/field')
  .get(adminController.get_all_field);

//TODO make a model for purchasable items
router.route('/shop')
    //Should return all items in the shop with their attribute
    .get()
    //Should let a user buy something
    .post()

module.exports = router
