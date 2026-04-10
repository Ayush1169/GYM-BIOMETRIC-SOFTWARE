const { Client, LocalAuth } = require("whatsapp-web.js")
const qrcode = require("qrcode-terminal")

let isReady = false

const client = new Client({
authStrategy: new LocalAuth(),
puppeteer:{
headless:true,
args:["--no-sandbox"]
}
})

client.on("qr",(qr)=>{
console.log("Scan QR with WhatsApp")
qrcode.generate(qr,{small:true})
})

client.on("ready",()=>{
console.log("✅ WhatsApp Bot Ready")
isReady = true
})

client.on("disconnected",()=>{
console.log("⚠ WhatsApp disconnected")
isReady = false
})

client.initialize()

const sendWhatsapp = async(phone,message)=>{

try{

if(!isReady){
console.log("⚠ WhatsApp not ready")
return
}

const clean = phone.replace(/\D/g,'').slice(-10)
const chatId = `91${clean}@c.us`

await client.sendMessage(chatId,message)

}catch(err){

console.log("WhatsApp send error:",err.message)

}

}

module.exports = { sendWhatsapp }