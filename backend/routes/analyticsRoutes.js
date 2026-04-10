const express = require("express")
const router = express.Router()

const {
getMonthlyRevenue,
getWeeklyRevenue,
getAttendanceAnalytics
} = require("../controllers/analyticsController")

router.get("/monthly-revenue",getMonthlyRevenue)
router.get("/weekly-revenue",getWeeklyRevenue)
router.get("/attendance",getAttendanceAnalytics)

module.exports = router