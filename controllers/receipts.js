const { Parser } = require('json2csv')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Receipt = require('../models/Receipt')
require('colors')
// const { clearKey } = require('../middleware/cache')

// @desc    Export all Receipts
// @route   Export /api/v1/receipts/export
// @access  Private
exports.exportReceipts = asyncHandler(async (req, res, next) => {
  const receipts = await Receipt.find()
  var filename = ['Receipts-', Date.now()].join('')
  var fields = [
    '_id',
    'receiptNumber',
    'amount',
    'modeOfPayment',
    'userRef',
    'poolRef',
    'paymentRef',
    'createdAt',
    'updatedAt',
  ]
  var fieldNames = [
    '#',
    'Receipt Number',
    'Amount',
    'Mode of Payment',
    'User Ref',
    'Pool Ref',
    'Receipt Ref',
    'Created At',
    'Updated At',
  ]
  const json2csvParser = new Parser({ fields })
  const csv = json2csvParser.parse(receipts)
  res.set(
    'Content-Disposition',
    ['attachment; filename=', filename, '.csv'].join('')
  )
  res.end(csv)
})

// @desc    Export single Receipt
// @route   Export /api/v1/receipts/:id/export
// @access  Public
exports.exportReceipt = asyncHandler(async (req, res, next) => {
  const receipt = await Receipt.findById(req.params.id)

  if (!receipt) {
    return next(
      new ErrorResponse(`Receipt not found with id of ${req.params.id}`, 404)
    )
  }
  var filename = ['Receipt-', Date.now()].join('')
  var fields = [
    '_id',
    'receiptNumber',
    'amount',
    'modeOfPayment',
    'userRef',
    'poolRef',
    'paymentRef',
    'createdAt',
    'updatedAt',
  ]
  var fieldNames = [
    '#',
    'Receipt Number',
    'Amount',
    'Mode of Payment',
    'User Ref',
    'Pool Ref',
    'Receipt Ref',
    'Created At',
    'Updated At',
  ]

  const json2csvParser = new Parser({ fields })
  const csv = json2csvParser.parse(receipt)
  res.set(
    'Content-Disposition',
    ['attachment; filename=', filename, '.csv'].join('')
  )
  res.end(csv)
})

// @desc    Get all Receipts
// @route   GET /api/v1/receipts
// @access  Private
exports.getReceipts = asyncHandler(async (req, res, next) => {
  const receipts = await Receipt.find()
  // const receipts = await Receipt.find().cache({
  //   time: 10,
  // })

  res.status(200).json({
    success: true,
    count: receipts.length,
    data: receipts,
  })
})

// @desc    Get single Receipt
// @route   GET /api/v1/receipts/:id
// @access  Public
exports.getReceipt = asyncHandler(async (req, res, next) => {
  const receipt = await Receipt.findById(req.params.id)
  // const receipt = await Receipt.findById(req.params.id).cache({
  //   time: 10,
  // })

  if (!receipt) {
    return next(
      new ErrorResponse(`Receipt not found with id of ${req.params.id}`, 404)
    )
  }

  res.status(200).json({
    success: true,
    data: receipt,
  })
})
