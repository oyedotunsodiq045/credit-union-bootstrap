const { Parser } = require('json2csv')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Community = require('../models/Community')
require('colors')
// const { clearKey } = require('../middleware/cache')

// @desc    Get all Communities
// @route   GET /api/v1/communities
// @access  Private
exports.getCommunities = asyncHandler(async (req, res, next) => {
  const communities = await Community.find()
  // const communities = await Community.find().cache({
  //   time: 10,
  // })

  res.status(200).json({
    success: true,
    count: communities.length,
    data: communities,
  })
})

// @desc    Get single Community
// @route   GET /api/v1/communities/:id
// @access  Public
exports.getCommunity = asyncHandler(async (req, res, next) => {
  const community = await Community.findById(req.params.id)
  // const community = await Community.findById(req.params.id).cache({
  //   time: 10,
  // })

  if (!community) {
    return next(
      new ErrorResponse(`Community not found with id of ${req.params.id}`, 404)
    )
  }

  res.status(200).json({
    success: true,
    data: community,
  })
})
