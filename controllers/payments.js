const { Parser } = require('json2csv')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Payment = require('../models/Payment')
require('colors')
const moment = require('moment')
// const { clearKey } = require('../middleware/cache')

// @desc    Get all Payments created this month
// @route   GET /api/v1/payments/month
// @access  Private
exports.getPaymentsMadeThisMonth = asyncHandler(async (req, res, next) => {
  let start = moment().startOf('month') // set to the first of this month, 12:00 am
  let end = moment().endOf('month') // set to the last day of this month, 23:59 pm

  const payments = await Payment.find({
    createdAt: {
      $gte: start,
      $lt: end,
    },
  })

  // const payments = await Payment.find({
  //   createdAt: {
  //     $gte: start,
  //     $lt: end,
  //   },
  // }).cache({
  //   time: 10,
  // })

  res.status(200).json({
    success: true,
    count: payments.length,
    data: payments,
  })
})

// @desc    Get all Payments created this week
// @route   GET /api/v1/payments/week
// @access  Private
exports.getPaymentsMadeThisWeek = asyncHandler(async (req, res, next) => {
  let start = moment().startOf('week') // set to the first day of this week, 12:00 am
  let end = moment().endOf('week') // set to the last day of this week, 23:59 pm

  const payments = await Payment.find({
    createdAt: {
      $gte: start,
      $lt: end,
    },
  })

  // const payments = await Payment.find({
  //   createdAt: {
  //     $gte: start,
  //     $lt: end,
  //   },
  // }).cache({
  //   time: 10,
  // })

  res.status(200).json({
    success: true,
    count: payments.length,
    data: payments,
  })
})

// @desc    Get all Payments created today
// @route   GET /api/v1/payments/today
// @access  Private
exports.getPaymentsMadeToday = asyncHandler(async (req, res, next) => {
  // Using Mongoose
  // let start = new Date();
  // start.setHours(0,0,0,0);

  // let end = new Date();
  // end.setHours(23,59,59,999);

  // Using Moment
  let start = moment().startOf('day') // set to 12:00 am today
  let end = moment().endOf('day') // set to 23:59 pm today

  const payments = await Payment.find({
    createdAt: {
      $gte: start,
      $lt: end,
    },
  })

  // const payments = await Payment.find({
  //   createdAt: {
  //     $gte: start,
  //     $lt: end,
  //   },
  // }).cache({
  //   time: 10,
  // })

  res.status(200).json({
    success: true,
    count: payments.length,
    data: payments,
  })
})

// @desc    Export all Payments
// @route   Export /api/v1/payments/export
// @access  Private
exports.exportPayments = asyncHandler(async (req, res, next) => {
  const payments = await Payment.find()
  var filename = ['payments-', Date.now()].join('')
  var fields = [
    '_id',
    'forMonth',
    'amount',
    'modeOfPayment',
    'receiptNumber',
    'photo',
    'userRef',
    'receiptRef',
    'createdAt',
    'updatedAt',
  ]
  var fieldNames = [
    '#',
    'For Month',
    'Amount Paid',
    'Mode of Payment',
    'Receipt Number',
    'Photo',
    'User Ref',
    'Receipt Ref',
    'Created At',
    'Updated At',
  ]

  const json2csvParser = new Parser({ fields })
  const csv = json2csvParser.parse(payments)
  res.set(
    'Content-Disposition',
    ['attachment; filename=', filename, '.csv'].join('')
  )
  res.end(csv)
})

// @desc    Export single Payment
// @route   Export /api/v1/payments/:id/export
// @access  Private
exports.exportPayment = asyncHandler(async (req, res, next) => {
  const payment = await Payment.findById(req.params.id)

  if (!payment) {
    return next(
      new ErrorResponse(`Payment not found with id of ${req.params.id}`, 404)
    )
  }
  var filename = ['Payment-', Date.now()].join('')
  var fields = [
    '_id',
    'forMonth',
    'amount',
    'modeOfPayment',
    'receiptNumber',
    'photo',
    'userRef',
    'receiptRef',
    'createdAt',
    'updatedAt',
  ]
  var fieldNames = [
    '#',
    'For Month',
    'Amount Paid',
    'Mode of Payment',
    'Receipt Number',
    'Photo',
    'User Ref',
    'Receipt Ref',
    'Created At',
    'Updated At',
  ]

  const json2csvParser = new Parser({ fields })
  const csv = json2csvParser.parse(payment)
  res.set(
    'Content-Disposition',
    ['attachment; filename=', filename, '.csv'].join('')
  )
  res.end(csv)
})

// @desc    Get all Payments
// @route   GET /api/v1/payments
// @access  Public
exports.getPayments = asyncHandler(async (req, res, next) => {
  const payments = await Payment.find()
  // const payments = await Payment.find().cache({
  //   time: 10,
  // })

  res.status(200).json({
    success: true,
    count: payments.length,
    data: payments,
  })
})

// @desc    Get single Payment
// @route   GET /api/v1/payments/:id
// @access  Public
exports.getPayment = asyncHandler(async (req, res, next) => {
  const payment = await Payment.findById(req.params.id)
  // const payment = await Payment.findById(req.params.id).cache({
  //   time: 10,
  // })

  if (!payment) {
    return next(
      new ErrorResponse(`Payment not found with id of ${req.params.id}`, 404)
    )
  }

  res.status(200).json({
    success: true,
    data: payment,
  })
})

// @desc    Create new Payment
// @route   POST /api/v1/payments
// @access  Private
exports.postPayment = asyncHandler(async (req, res, next) => {
  const payment = await Payment.create(req.body)

  res.status(201).json({
    success: true,
    data: payment,
  })
})

// @desc    Update Payment
// @route   PUT /api/v1/payments/:id
// @access  Private
// exports.updatePayment = asyncHandler(async (req, res, next) => {
//   const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   })

//   if (!payment) {
//     return next(
//       next(
//         new ErrorResponse(`Payment not found with id of ${req.params.id}`, 404)
//       )
//     )
//   }

//   res.status(200).json({
//     success: true,
//     data: payment,
//   })
// })

// @desc    Delete Payment
// @route   DELETE /api/v1/payments/:id
// @access  Private
exports.deletePayment = asyncHandler(async (req, res, next) => {
  const payment = await Payment.findByIdAndDelete(req.params.id)

  if (!payment) {
    return next(
      next(
        new ErrorResponse(`Payment not found with id of ${req.params.id}`, 404)
      )
    )
  }

  res.status(200).json({
    success: true,
    data: {},
  })
})
