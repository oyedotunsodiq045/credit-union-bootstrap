const express = require('express')
const {
  exportReceipts,
  exportReceipt,
  getReceipts,
  getReceipt,
} = require('../controllers/receipts')

const router = express.Router()

router.route('/').get(getReceipts)

router.route('/export').get(exportReceipts)

router.route('/:id').get(getReceipt)

router.route('/:id/export').get(exportReceipt)

module.exports = router
