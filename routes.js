const express = require('express')
const userController = require('./controllers/userController.js')
const router = express.Router()

router.post('/user', userController.add_user)
router.get('/user', userController.get_user)

module.exports = router
