"use client"

import { useEffect, useState } from "react"
import {
BarChart,
Bar,
LineChart,
Line,
XAxis,
YAxis,
Tooltip,
CartesianGrid,
ResponsiveContainer
} from "recharts"

import * as XLSX from "xlsx"
import { saveAs } from "file-saver"

/* ---------- TYPES ---------- */

type RevenueData = {
month?: string
week?: string
revenue: number
}

type AttendanceData = {
day: string
attendance: number
}

/* ---------- COMPONENT ---------- */

export default function Analytics() {

const [monthly, setMonthly] = useState<RevenueData[]>([])
const [weekly, setWeekly] = useState<RevenueData[]>([])
const [attendance, setAttendance] = useState<AttendanceData[]>([])
const [month, setMonth] = useState(new Date().getMonth() + 1)

/* ---------- FETCH DATA ---------- */

useEffect(() => {

fetch("http://localhost:5000/api/analytics/monthly-revenue")
  .then(res => res.json())
  .then(data => setMonthly(data))

fetch(`http://localhost:5000/api/analytics/weekly-revenue?month=${month}`)
  .then(res => res.json())
  .then(data => setWeekly(data))

fetch(`http://localhost:5000/api/analytics/attendance?month=${month}`)
  .then(res => res.json())
  .then(data => setAttendance(data))
  }, [month])
  /* ---------- EXPORT EXCEL ---------- */

const exportExcel = (data: any[], name: string) => {

const worksheet = XLSX.utils.json_to_sheet(data)
const workbook = XLSX.utils.book_new()

XLSX.utils.book_append_sheet(workbook, worksheet, "Report")

const file = XLSX.write(workbook, {
  bookType: "xlsx",
  type: "array"
})

saveAs(
  new Blob([file], { type: "application/octet-stream" }),
  `${name}.xlsx`
)

}

/* ---------- UI ---------- */

return (

<div>

  <h1 className="text-3xl font-bold mb-8">
    📊 Gym Analytics
  </h1>

  {/* Month Filter */}

 <div className="flex gap-4 mb-6">

<select
value={month}
onChange={(e) => setMonth(Number(e.target.value))}
className="bg-slate-800 p-2 rounded"
>
{[1,2,3,4,5,6,7,8,9,10,11,12].map((m) => (
<option key={m} value={m}>
Month {m}
</option>
))}
</select>

<button
onClick={() => exportExcel(monthly, "monthly-revenue")}
className="bg-green-600 px-4 py-2 rounded"
>
Export Revenue
</button>

<button
onClick={() => exportExcel(weekly, "weekly-revenue")}
className="bg-blue-600 px-4 py-2 rounded"
>
Export Weekly
</button>

<button
onClick={() => exportExcel(attendance, "attendance")}
className="bg-purple-600 px-4 py-2 rounded"
>
Export Attendance
</button>

</div>

  {/* Monthly Revenue */}

  <div className="bg-[#1e293b] p-6 rounded-xl mb-8">

    <h2 className="text-xl font-bold mb-4 text-green-400">
      Monthly Revenue
    </h2>

    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={monthly}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151"/>
        <XAxis dataKey="month"/>
        <YAxis/>
        <Tooltip/>
        <Bar dataKey="revenue" fill="#22c55e"/>
      </BarChart>
    </ResponsiveContainer>

  </div>

  {/* Weekly Revenue */}

  <div className="bg-[#1e293b] p-6 rounded-xl mb-8">

    <h2 className="text-xl font-bold mb-4 text-cyan-400">
      Weekly Revenue
    </h2>

    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={weekly}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151"/>
        <XAxis dataKey="week"/>
        <YAxis/>
        <Tooltip/>
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#06b6d4"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>

  </div>

  {/* Attendance */}

  <div className="bg-[#1e293b] p-6 rounded-xl">

    <h2 className="text-xl font-bold mb-4 text-purple-400">
      Attendance
    </h2>

    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={attendance}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151"/>
        <XAxis dataKey="day"/>
        <YAxis/>
        <Tooltip/>
        <Bar dataKey="attendance" fill="#a855f7"/>
      </BarChart>
    </ResponsiveContainer>

  </div>

</div>

)
}