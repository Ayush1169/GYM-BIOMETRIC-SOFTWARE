const Payment = require("../models/Payment");
const Attendance = require("../models/Attendance");

exports.getMonthlyRevenue = async (req, res) => {
  try {

    const data = await Payment.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$amount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const result = data.map(d => ({
      month: months[d._id - 1],
      revenue: d.revenue
    }));

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getWeeklyRevenue = async (req,res)=>{

const month = parseInt(req.query.month)

const data = await Payment.aggregate([

{
$match:{
$expr:{ $eq:[{$month:"$createdAt"},month] }
}
},

{
$group:{
_id:{ $week:"$createdAt" },
revenue:{ $sum:"$amount" }
}
},

{ $sort:{ _id:1 } }

])

const result = data.map(d=>({
week:`Week ${d._id}`,
revenue:d.revenue
}))

res.json(result)

}

exports.getAttendanceAnalytics = async (req,res)=>{

const month = parseInt(req.query.month)

const data = await Attendance.aggregate([

{
$match:{
$expr:{ $eq:[{$month:"$createdAt"},month] }
}
},

{
$group:{
_id:{ $dayOfWeek:"$createdAt" },
count:{ $sum:1 }
}
},

{ $sort:{ _id:1 } }

])

const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

const result = data.map(d=>({
day:days[d._id-1],
attendance:d.count
}))

res.json(result)

}