const ZKLib = require("node-zklib")
const Member = require("../models/Member")
const Attendance = require("../models/Attendance")

require("dotenv").config()

const OWNER_PHONE = process.env.OWNER_PHONE

const zk = new ZKLib(
  process.env.DEVICE_IP,
  Number(process.env.DEVICE_PORT),
  10000,
  4000
)
const { sendWhatsapp } = require("./whatsapp")


let lastLogTime = null
let enrollMemberId = null
let knownUsers = []
let messageCooldown = {}



async function checkNewFingerprints(){

try{

const users = await zk.getUsers()

for(const u of users.data){

if(!knownUsers.includes(u.userId)){

knownUsers.push(u.userId)

if(enrollMemberId){

await Member.findByIdAndUpdate(
enrollMemberId,
{ fingerprintId: u.userId }
)

console.log("✅ Fingerprint linked to member")

enrollMemberId = null

}

}

}

}catch(err){

console.log("Fingerprint sync error:",err)

}

}

async function startBiometricSync(){

try{

await zk.createSocket()

console.log("✅ Device connected")

// load last device log to avoid spam
const oldLogs = await zk.getAttendances()

if(oldLogs?.data?.length){
lastLogTime = new Date(
oldLogs.data[oldLogs.data.length - 1].recordTime
)
}

setInterval(async ()=>{

try{
await checkNewFingerprints()
const logs = await zk.getAttendances()

if(!logs || !logs.data || logs.data.length === 0) return

for(const log of logs.data){

const userId = log.deviceUserId
const logTime = new Date(log.recordTime)

// ignore old logs
if(lastLogTime && logTime <= lastLogTime) continue

lastLogTime = logTime

const member = await Member.findOne({
fingerprintId:userId
})

if(!member) continue

const today = new Date()
today.setHours(0,0,0,0)

const expiry = new Date(member.expiryDate)
expiry.setHours(0,0,0,0)

if(expiry < today){

const now = Date.now()

if(messageCooldown[member._id] && now - messageCooldown[member._id] < 300000){
continue
}

messageCooldown[member._id] = now

console.log("❌ Expired member tried entry:",member.name)

await sendWhatsapp(
member.phone,
`⚠ Hello ${member.name}

Your gym membership has expired.

Please renew your membership.

Gym Team 💪`
)

await sendWhatsapp(
OWNER_PHONE,
`⚠ Expired Member Attempt

Name: ${member.name}
Phone: ${member.phone}`
)

continue
}

// check today's attendance

const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000)

const recentEntry = await Attendance.findOne({
memberId:member._id,
createdAt:{$gte:sixHoursAgo}
})

if(recentEntry){

console.log("❌ Entry blocked (6 hour rule):",member.name)

// Member message
await sendWhatsapp(
member.phone,
`❌ Entry blocked

You can access the gym once every 6 hours`
)

// Owner alert
await sendWhatsapp(
OWNER_PHONE,
`⚠ Access Attempt

Member: ${member.name}
Phone: ${member.phone}

Reason: 6 hour rule`
)

continue
}

await Attendance.create({
memberId:member._id,
createdAt:logTime
})

console.log("✅ Attendance saved:",member.name)

}

}catch(err){

console.log("Device log error:",err)

}

},10000)

}catch(err){

console.log("Device connection error:",err)

}

}

function setEnrollMember(memberId){
  enrollMemberId = memberId
}

module.exports = {
  startBiometricSync,
  setEnrollMember
}