const express = require('express')
const {
  getPaymentsMadeThisMonth,
  getPaymentsMadeThisWeek,
  getPaymentsMadeToday,
  exportPayments,
  exportPayment,
  getPayments,
  getPayment,
  postPayment,
  //   updatePayment,
  deletePayment,
} = require('../controllers/payments')

const router = express.Router()

router.route('/').get(getPayments).post(postPayment)

router.route('/export').get(exportPayments)

router.route('/month').get(getPaymentsMadeThisMonth)
router.route('/week').get(getPaymentsMadeThisWeek)
router.route('/today').get(getPaymentsMadeToday)

// router.route('/:id').get(getPayment).put(updatePayment).delete(deletePayment)
router.route('/:id').get(getPayment).delete(deletePayment)

router.route('/:id/export').get(exportPayment)

module.exports = router
