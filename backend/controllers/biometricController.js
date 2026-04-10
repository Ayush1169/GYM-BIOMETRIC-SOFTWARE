const biometricService = require("../services/biometricService")

exports.startEnroll = async (req,res)=>{

try{

biometricService.setEnrollMember(req.body.memberId)

res.json({
message:"Ask member to place finger on device"
})

}catch(err){

res.status(500).json({error:err.message})

}

}