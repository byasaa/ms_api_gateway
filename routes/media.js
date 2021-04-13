const express = require('express')
const { verifyToken } = require('../middlewares')
const router = express.Router()

const mediaHandler = require('./handler/media')

router.get('/', verifyToken, mediaHandler.get)
router.post('/', mediaHandler.create)
router.delete('/:id', mediaHandler.destroy)

module.exports = router
