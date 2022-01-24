const express = require('express')
const {
  exportPools,
  exportPool,
  getPools,
  getPool,
} = require('../controllers/pools')

const router = express.Router()

router.route('/').get(getPools)

router.route('/export').get(exportPools)

router.route('/:id').get(getPool)

router.route('/:id/export').get(exportPool)

module.exports = router
