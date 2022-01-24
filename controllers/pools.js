const { Parser } = require('json2csv')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Pool = require('../models/Pool')
require('colors')
// const { clearKey } = require('../middleware/cache')

// @desc    Export all Pools
// @route   Export /api/v1/pools/export
// @access  Private
exports.exportPools = asyncHandler(async (req, res, next) => {
  const pools = await Pool.find()
  var filename = ['Pools-', Date.now()].join('')
  var fields = [
    '_id',
    'amount',
    'userRef',
    'receiptRef',
    'createdAt',
    'updatedAt',
  ]
  var fieldNames = [
    '#',
    'Amount',
    'User Ref',
    'Receipt Ref',
    'Created At',
    'Updated At',
  ]
  const json2csvParser = new Parser({ fields })
  const csv = json2csvParser.parse(pools)
  res.set(
    'Content-Disposition',
    ['attachment; filename=', filename, '.csv'].join('')
  )
  res.end(csv)
})

// @desc    Export single Pool
// @route   Export /api/v1/pools/:id/export
// @access  Public
exports.exportPool = asyncHandler(async (req, res, next) => {
  const pool = await Pool.findById(req.params.id)

  if (!pool) {
    return next(
      new ErrorResponse(`Pool not found with id of ${req.params.id}`, 404)
    )
  }
  var filename = ['Pool-', Date.now()].join('')
  var fields = [
    '_id',
    'amount',
    'userRef',
    'receiptRef',
    'createdAt',
    'updatedAt',
  ]
  var fieldNames = [
    '#',
    'Amount',
    'User Ref',
    'Receipt Ref',
    'Created At',
    'Updated At',
  ]

  const json2csvParser = new Parser({ fields })
  const csv = json2csvParser.parse(pool)
  res.set(
    'Content-Disposition',
    ['attachment; filename=', filename, '.csv'].join('')
  )
  res.end(csv)
})

// @desc    Get all Pools
// @route   GET /api/v1/pools
// @access  Private
exports.getPools = asyncHandler(async (req, res, next) => {
  const pools = await Pool.find()
  // const pools = await Pool.find().cache({
  //   time: 10,
  // })

  res.status(200).json({
    success: true,
    count: pools.length,
    data: pools,
  })
})

// @desc    Get single Pool
// @route   GET /api/v1/pools/:id
// @access  Public
exports.getPool = asyncHandler(async (req, res, next) => {
  const pool = await Pool.findById(req.params.id)
  // const pool = await Pool.findById(req.params.id).cache({
  //   time: 10,
  // })

  if (!pool) {
    return next(
      new ErrorResponse(`Pool not found with id of ${req.params.id}`, 404)
    )
  }

  res.status(200).json({
    success: true,
    data: pool,
  })
})
