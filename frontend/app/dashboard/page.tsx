"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar 
} from "recharts";

export default function Dashboard() {

  const [stats, setStats] = useState<any>(null);
  const [revenue, setRevenue] = useState<any>(null);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [checkins, setCheckins] = useState<any[]>([]);
  const [topMembers, setTopMembers] = useState<any[]>([]);
  const [planData, setPlanData] = useState<any[]>([]);

  useEffect(() => {

    fetch("http://localhost:5000/api/members/stats")
      .then((res) => res.json())
      .then((data) => setStats(data));

    fetch("http://localhost:5000/api/members/revenue")
      .then((res) => res.json())
      .then((data) => setRevenue(data));

    fetch("http://localhost:5000/api/members/weekly-revenue")
      .then((res) => res.json())
      .then((data) => setWeeklyData(data));

      fetch("http://localhost:5000/api/members/monthly-revenue")
  .then((res) => res.json())
  .then((data) => {
  console.log("Monthly API:", data);
  setMonthlyData(data);
});

    fetch("http://localhost:5000/api/members/daily-checkins")
  .then((res) => res.json())
  .then((data) => setCheckins(data));

  fetch("http://localhost:5000/api/members/top-members")
  .then((res) => res.json())
  .then((data) => setTopMembers(data));

  fetch("http://localhost:5000/api/members/plan-distribution")
  .then((res) => res.json())
  .then((data) => setPlanData(data));

  
}, []);

  if (!stats || !revenue) return <div className="p-10">Loading...</div>;

  const pieData = weeklyData.map((d:any) => ({
    name: d.day,
    value: d.revenue
  }));

  const monthlyPie = Array.isArray(monthlyData)
  ? monthlyData.map((d:any)=>({
      name: d.month,
      value: d.revenue
    }))
  : [];

  const COLORS = [
    "#06b6d4",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#3b82f6",
    "#a855f7",
    "#14b8a6"
  ];

  return (

    <div className="p-8 text-white">

      <h1 className="text-3xl font-bold mb-8">
        📊 Gym Dashboard
      </h1>

      {/* Top Cards */}

      <div className="grid grid-cols-5 gap-6 mb-10">

        <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700">
          <p className="text-gray-400">Total Members</p>
          <h2 className="text-2xl font-bold text-cyan-400">
            {stats.total}
          </h2>
        </div>

        <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700">
          <p className="text-gray-400">Active Members</p>
          <h2 className="text-2xl font-bold text-green-400">
            {stats.active}
          </h2>
        </div>

        <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700">
          <p className="text-gray-400">Archived Members</p>
          <h2 className="text-2xl font-bold text-red-400">
            {stats.archived}
          </h2>
        </div>

        <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700">
          <p className="text-gray-400">Expired Members</p>
          <h2 className="text-2xl font-bold text-orange-400">
            {stats.expired}
          </h2>
        </div>

        <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700">

          <p className="text-gray-400">Total Revenue</p>

          <h2 className="text-2xl font-bold text-yellow-400">
            ₹ {revenue.totalRevenue}
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            This Month: ₹ {revenue.monthRevenue}
          </p>

          <div className="mt-3 text-sm">
            <p className="text-green-400">
              Cash: ₹ {revenue.cashRevenue}
            </p>

            <p className="text-blue-400">
              Online: ₹ {revenue.onlineRevenue}
            </p>
          </div>

        </div>

      </div>

      {/* Charts Section */}

      <div className="grid grid-cols-2 gap-6">

        {/* Weekly Revenue Line Chart */}

        <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700">

          <h2 className="text-xl font-bold mb-4 text-cyan-400">
            Weekly Revenue
          </h2>

          <ResponsiveContainer width="100%" height={300}>

            <LineChart data={weeklyData}>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
              />

              <XAxis
                dataKey="day"
                stroke="#ccc"
              />

              <YAxis stroke="#ccc" />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={{ r: 5 }}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>


        {/* Weekly Revenue Pie Chart */}

        <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700">

          <h2 className="text-xl font-bold mb-4 text-cyan-400">
            Weekly Revenue Distribution
          </h2>

          <ResponsiveContainer width="100%" height={300}>

            <PieChart>

              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={110}
                label
              >

                {pieData.map((entry:any, index:number) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>
       
       <div className="grid grid-cols-2 gap-6 mt-6">

{/* Monthly Bar Chart */}

<div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700">

<h2 className="text-xl font-bold mb-4 text-green-400">
Monthly Revenue
</h2>

<ResponsiveContainer width="100%" height={300}>

<BarChart data={monthlyData}>

<CartesianGrid strokeDasharray="3 3" stroke="#374151"/>

<XAxis dataKey="month" stroke="#ccc"/>

<YAxis stroke="#ccc"/>

<Tooltip/>

<Bar dataKey="revenue" fill="#22c55e" radius={[6,6,0,0]}/>

</BarChart>

</ResponsiveContainer>

</div>


{/* Monthly Pie */}

<div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700">

<h2 className="text-xl font-bold mb-4 text-green-400">
Monthly Revenue Distribution
</h2>

<ResponsiveContainer width="100%" height={300}>

<PieChart>

<Pie
data={monthlyPie}
dataKey="value"
nameKey="name"
cx="50%"
cy="50%"
outerRadius={110}
label
>

{monthlyPie.map((entry:any,index:number)=>(
<Cell key={index} fill={COLORS[index % COLORS.length]} />
))}

</Pie>

<Tooltip/>

</PieChart>

</ResponsiveContainer>

</div>

</div>

    <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 mt-6">

<h2 className="text-xl font-bold mb-6 text-purple-400">
🏋️ Daily Gym Check-ins
</h2>

<ResponsiveContainer width="100%" height={320}>

<BarChart
  data={Array.isArray(checkins) ? checkins : []}
  barCategoryGap="35%"
>

<CartesianGrid
  strokeDasharray="3 3"
  stroke="#374151"
  vertical={false}
/>

<XAxis
  dataKey="day"
  stroke="#9ca3af"
  tick={{ fill: "#cbd5f5", fontSize: 13 }}
/>

<YAxis
  stroke="#9ca3af"
  tick={{ fill: "#cbd5f5", fontSize: 13 }}
/>

<Tooltip
  cursor={{ fill: "rgba(139,92,246,0.1)" }}
  contentStyle={{
    backgroundColor: "#0f172a",
    border: "1px solid #374151",
    borderRadius: "8px",
    color: "#fff"
  }}
/>

<Bar dataKey="checkins" radius={[8,8,0,0]}>

{checkins.map((entry:any,index:number)=>{

const colors = [
"#8b5cf6",
"#22c55e",
"#06b6d4",
"#f59e0b",
"#ef4444",
"#3b82f6",
"#ec4899"
]

return (
<Cell
 key={index}
 fill={colors[index % colors.length]}
/>
)

})}

</Bar>

</BarChart>

</ResponsiveContainer>

</div>

<div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 mt-6">

<h2 className="text-xl font-bold mb-6 text-yellow-400">
🏆 Most Active Members
</h2>

<div className="space-y-4">

{topMembers.map((m:any,index:number)=>{

const medals = ["🥇","🥈","🥉","4️⃣","5️⃣"]

return (

<div
key={index}
className="flex items-center justify-between bg-[#0f172a] p-4 rounded-lg border border-gray-700"
>

<div className="flex items-center gap-3">

<span className="text-xl">
{medals[index]}
</span>

<div>

<p className="font-semibold text-white">
{m.name}
</p>

<p className="text-sm text-gray-400">
{m.phone}
</p>

</div>

</div>

<p className="text-cyan-400 font-bold">
{m.visits} visits
</p>

</div>

)

})}

</div>

</div>

<div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 mt-6">

<h2 className="text-xl font-bold mb-6 text-pink-400">
📊 Membership Plan Distribution
</h2>

<ResponsiveContainer width="100%" height={320}>

<PieChart>

<Pie
data={planData}
dataKey="members"
nameKey="plan"
cx="50%"
cy="50%"
outerRadius={110}
label
>

{planData.map((entry:any,index:number)=>{

const colors = [
"#22c55e",
"#3b82f6",
"#f59e0b",
"#ef4444"
]

return (
<Cell
key={index}
fill={colors[index % colors.length]}
/>
)

})}

</Pie>

<Tooltip/>

</PieChart>

</ResponsiveContainer>

</div>

    </div>

  );
}