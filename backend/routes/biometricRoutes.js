const express = require("express")
const router = express.Router()

const {startEnroll} = require("../controllers/biometricController")

router.post("/start-enroll",startEnroll)

module.exports = router