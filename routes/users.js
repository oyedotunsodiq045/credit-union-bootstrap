const express = require('express')
const {
  getThisMonthRegisteredMembers,
  getThisWeekRegisteredMembers,
  getTodayRegisteredMembers,
  getAdmins,
  getMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember,
  exportPools,
  exportPool,
} = require('../controllers/users')

const Member = require('../models/User')

const router = express.Router({
  mergeParams: true,
})

const advancedResults = require('../middleware/advancedResults')

const { protect, authorize } = require('../middleware/auth')

router.use(protect)
router.use(authorize('admin'))

router.route('/month').get(getThisMonthRegisteredMembers)

router.route('/week').get(getThisWeekRegisteredMembers)

router.route('/today').get(getTodayRegisteredMembers)

router.route('/admins').get(getAdmins)

router.route('/').get(advancedResults(User), getMembers).post(createMember)

router.route('/:id').get(getMember).put(updateMember).delete(deleteMember)

router.route('/export').get(exportPools)

router.route('/:id/export').get(exportPool)

module.exports = router
