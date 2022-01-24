const express = require('express')
const { getCommunities, getCommunity } = require('../controllers/communities')

const router = express.Router()

router.route('/').get(getCommunities)
router.route('/:id').get(getCommunity)

module.exports = router
