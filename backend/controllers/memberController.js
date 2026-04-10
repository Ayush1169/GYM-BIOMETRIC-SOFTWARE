const Member = require("../models/Member");
const Attendance = require("../models/Attendance");
const Payment = require("../models/Payment");
const ZKLib = require("node-zklib");

const zk = new ZKLib("192.168.1.9", 4370, 10000, 4000);

exports.createMember = async (req, res) => {
    //  console.log("BODY DATA:", req.body);
 
    const { name, phone, age, gender, planMonths, fingerprintId, paymentMethod } = req.body;
     try {
    const priceMap = {
      1: 1000,
      3: 2500,
      6: 4500,
      12: 8000,
    };

    const price = priceMap[Number(planMonths)];

    if (!price) {
        return res.status(400).json({
            error: "Invalid plan duration"
        })
    }

    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + planMonths);

    const member = await Member.create({
      name,
      phone,
      age,
      gender,
      fingerprintId,
      planType: `${planMonths} Months`,
      startDate,
      expiryDate,
      price,
    });

    await Payment.create({
      memberId: member._id,
      amount: price,
      paymentMethod,
    });

    res.status(201).json(member);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMembers = async (req, res) => {
  try {
    const members = await Member.find({
      isArchived: false,
      status: "active"
    });

    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePlan = async (req, res) => {
  try {
    const { planMonths } = req.body;

    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    const newExpiry = new Date();
    newExpiry.setMonth(newExpiry.getMonth() + planMonths);

    member.startDate = new Date();
    member.expiryDate = newExpiry;
    member.status = "active";
    member.planType = `${planMonths} Months`;

    await member.save();

    res.json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteMember = async (req, res) => {
  try {

    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    // 1️⃣ biometric device se fingerprint delete karo
    if (member.fingerprintId) {
      try {

        await zk.createSocket();

        await zk.deleteUserData(member.fingerprintId)

        await zk.disconnect();

        console.log("Fingerprint deleted from device");

      } catch (err) {
        console.log("Device delete error:", err);
      }
    }

    // 2️⃣ database me archive karo
    member.isArchived = true;
    member.status = "expired";

    await member.save();

    res.json({ message: "Member archived and fingerprint removed" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    const { memberId } = req.body;

    const member = await Member.findOne({
  _id: memberId,
  isArchived: false
});

    if (!member || member.status === "expired") {
      return res.status(403).json({ error: "Access Denied" });
    }

    const attendance = await Attendance.create({
      memberId,
    });

    res.json({ message: "Entry Allowed", attendance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStats = async (req, res) => {

  const today = new Date();

await Member.updateMany(
{
  expiryDate: { $lt: today },
  status: "active"
},
{
  $set: { status: "expired" }
}
);

  try {

    const total = await Member.countDocuments({
      isArchived: false
    });

    const active = await Member.countDocuments({
      status: "active",
      isArchived: false
    });

    const archived = await Member.countDocuments({
      isArchived: true
    });
    const expired = await Member.countDocuments({
      status: "expired",
      isArchived: false
    });

    res.json({
      total,
      active,
      archived,
      expired
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("memberId", "name phone")
      .sort({ createdAt: -1 });

    const filtered = attendance.filter(a => a.memberId);

    res.json(filtered);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.biometricAccess = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "UserId required" });
    }

    // fingerprintId se member find karo
    const member = await Member.findOne({ fingerprintId: userId });

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    if (member.status === "expired") {
      return res.status(403).json({ error: "Plan Expired" });
    }

    // Attendance mark karo
    await Attendance.create({
      memberId: member._id,
    });

    // Yaha future me relay trigger hoga
    console.log("Gate Open Signal Sent 🚪");

    return res.json({ success: true, message: "Access Granted" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRevenue = async (req, res) => {
  try {
    const payments = await Payment.find();

    const totalRevenue = payments.reduce(
      (sum, p) => sum + p.amount,
      0
    );

    const cashRevenue = payments
      .filter(p => p.paymentMethod === "cash")
      .reduce((sum, p) => sum + p.amount, 0);

    const onlineRevenue = payments
      .filter(p => p.paymentMethod === "online")
      .reduce((sum, p) => sum + p.amount, 0);

    res.json({
      totalRevenue,
      cashRevenue,
      onlineRevenue,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWeeklyRevenue = async (req, res) => {
  try {
    const payments = await Payment.find();

    const result = {};

    payments.forEach(p => {
      const date = new Date(p.createdAt).toLocaleDateString();

      if (!result[date]) {
        result[date] = 0;
      }

      result[date] += p.amount;
    });

    const data = Object.keys(result).map(day => ({
      day,
      revenue: result[day],
    }));

    res.json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getArchivedMembers = async (req, res) => {
  try {
    const members = await Member.find({
      isArchived: true
    });

    res.json(members);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.permanentDeleteMember = async (req, res) => {
  try {

    await Member.findByIdAndDelete(req.params.id);

    res.json({ message: "Member permanently deleted" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.restoreMember = async (req, res) => {
  try {

    const { planMonths } = req.body;

    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    const startDate = new Date();
    const expiryDate = new Date();

    expiryDate.setMonth(expiryDate.getMonth() + planMonths);

    member.startDate = startDate;
    member.expiryDate = expiryDate;
    member.planType = `${planMonths} Months`;
    member.status = "active";
    member.isArchived = false;

    await member.save();

    res.json({ message: "Member Restored", member });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMemberById = async (req, res) => {

  try {

    const member = await Member.findById(req.params.id);

    res.json(member);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

exports.getMemberAttendance = async (req, res) => {
  try {

    const attendance = await Attendance.find({
      memberId: req.params.id
    }).sort({ createdAt: -1 });

    const totalVisits = attendance.length;

    const lastVisit = attendance.length
      ? attendance[0].createdAt
      : null;

    res.json({
      totalVisits,
      lastVisit,
      history: attendance
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getExpiredMembers = async (req,res)=>{

try{

const today = new Date()
const members = await Member.find({
expiryDate: { $lt: today },
isArchived:false
})

res.json(members)

}catch(err){

console.log(err)
res.status(500).json({error:err.message})

}

}

exports.getMonthlyRevenue = async (req, res) => {
  try {

    const payments = await Payment.find();

    const result = {};

    payments.forEach(p => {

      const month = new Date(p.createdAt).toLocaleString("default", {
        month: "short"
      });

      if (!result[month]) {
        result[month] = 0;
      }

      result[month] += p.amount;

    });

    const data = Object.keys(result).map(m => ({
      month: m,
      revenue: result[m]
    }));

    res.json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDailyCheckins = async (req, res) => {
  try {

    const attendance = await Attendance.find();

    const result = {};

    attendance.forEach(a => {

      const day = new Date(a.createdAt).toLocaleDateString("en-IN", {
        weekday: "short"
      });

      if (!result[day]) {
        result[day] = 0;
      }

      result[day] += 1;

    });

    const data = Object.keys(result).map(day => ({
      day,
      checkins: result[day]
    }));

    res.json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTopMembers = async (req, res) => {
  try {

    const leaderboard = await Attendance.aggregate([

      {
        $group: {
          _id: "$memberId",
          visits: { $sum: 1 }
        }
      },

      {
        $sort: { visits: -1 }
      },

      {
        $limit: 5
      },

      {
        $lookup: {
          from: "members",
          localField: "_id",
          foreignField: "_id",
          as: "member"
        }
      },

      {
        $unwind: "$member"
      },

      {
        $project: {
          name: "$member.name",
          phone: "$member.phone",
          visits: 1
        }
      }

    ]);

    res.json(leaderboard);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPlanDistribution = async (req, res) => {
  try {

    const data = await Member.aggregate([

      {
        $match: {
          isArchived: false
        }
      },

      {
        $group: {
          _id: "$planType",
          members: { $sum: 1 }
        }
      },

      {
        $project: {
          plan: "$_id",
          members: 1,
          _id: 0
        }
      }

    ]);

    res.json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.clearAttendance = async (req,res)=>{

try{

await Attendance.deleteMany({
memberId:req.params.id
})

res.json({
message:"Attendance cleared"
})

}catch(err){

res.status(500).json({error:err.message})

}

}