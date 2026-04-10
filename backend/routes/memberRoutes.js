const express = require("express");
const router = express.Router();
const { createMember, getMembers, updatePlan, deleteMember, getStats, getAttendance, biometricAccess, getRevenue, getWeeklyRevenue, getArchivedMembers, permanentDeleteMember, restoreMember, getMemberById, getDailyCheckins, getTopMembers, getPlanDistribution, getMemberAttendance, getExpiredMembers, getMonthlyRevenue, clearAttendance } = require("../controllers/memberController");
const { markAttendance } = require("../controllers/memberController");

router.post("/attendance", markAttendance);
router.post("/", createMember);

router.get("/stats", getStats);
router.get("/attendance", getAttendance);
router.post("/biometric-access", biometricAccess);

router.get("/revenue", getRevenue);
router.get("/weekly-revenue", getWeeklyRevenue);
router.get("/monthly-revenue", getMonthlyRevenue);
router.get("/daily-checkins", getDailyCheckins);
router.get("/top-members", getTopMembers);
router.get("/plan-distribution", getPlanDistribution);

router.get("/archived", getArchivedMembers);
router.get("/expired", getExpiredMembers);

router.delete("/permanent/:id", permanentDeleteMember);
router.put("/restore/:id", restoreMember);
router.put("/:id/renew", updatePlan);
router.delete("/:id/attendance",clearAttendance)

router.get("/:id/attendance", getMemberAttendance);
router.get("/:id", getMemberById);   // ALWAYS LAST
router.get("/", getMembers);

router.delete("/:id", deleteMember);


module.exports = router;
