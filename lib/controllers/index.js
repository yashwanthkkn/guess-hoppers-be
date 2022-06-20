const express = require('express')
const router = express.Router()
const user = require('./user.controller')
const room = require('./room.controller')

router.use('/user',user)
router.use('/room',room)

module.exports = router