"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";        

export default function MemberProfile() {

  const params = useParams();
  const id = params.id;

  const [member, setMember] = useState(null);
  const [attendance, setAttendance] = useState(null);

  useEffect(() => {

    fetch(`http://localhost:5000/api/members/${id}`)
      .then(res => res.json())
      .then(data => setMember(data));

  }, []);

  useEffect(() => {

  fetch(`http://localhost:5000/api/members/${id}/attendance`)
    .then(res => res.json())
    .then(data => setAttendance(data));

}, [id]);

const clearAttendance = async ()=>{

if(!confirm("Clear attendance history?")) return

await fetch(`http://localhost:5000/api/members/${id}/attendance`,{
method:"DELETE"
})

alert("Attendance cleared")

location.reload()

}

  if (!member) return <div className="p-10">Loading...</div>;

  return (

    <div className="p-10 text-white">

      <h1 className="text-3xl font-bold mb-6">
        Member Profile
      </h1>

      <div className="space-y-3 bg-[#1e293b] p-6 rounded-xl">

        <p><b>Name:</b> {member.name}</p>

        <p><b>Age:</b> {member.age}</p>

        <p><b>Gender:</b> {member.gender}</p>

        <p><b>Phone:</b> {member.phone}</p>

        <p><b>Plan:</b> {member.planType}</p>

        <p>
          <b>Joined:</b> {new Date(member.startDate).toLocaleDateString()}
        </p>

        <p>
          <b>Expiry:</b> {new Date(member.expiryDate).toLocaleDateString()}
        </p>

        <p><b>Status:</b> {member.status}</p>

        <p><b>Fingerprint ID:</b> {member.fingerprintId}</p>

      </div>

      <div className="mt-6 bg-[#1e293b] p-6 rounded-xl">

<h2 className="text-xl font-bold mb-4">
Attendance Info
</h2>



<p>
<b>Total Visits:</b> {attendance?.totalVisits || 0}
</p>

<p>
<b>Last Visit:</b>
{attendance?.lastVisit
  ? new Date(attendance.lastVisit).toLocaleDateString()
  : "No visit"}
</p>

</div>

<div className="mt-6 bg-[#1e293b] p-6 rounded-xl">

<h2 className="text-xl font-bold mb-4">
Attendance History
</h2>

<button
onClick={clearAttendance}
className="bg-red-600 px-4 py-2 rounded mb-4"
>
Clear Attendance
</button>

<table className="w-full text-left">

<thead>
<tr>
<th>Date</th>
<th>Time</th>
</tr>
</thead>

<tbody>

{attendance?.history?.map((a) => (

<tr key={a._id}>

<td>
{new Date(a.createdAt).toLocaleDateString()}
</td>

<td>
{new Date(a.createdAt).toLocaleTimeString()}
</td>

</tr>

))}

</tbody>

</table>

</div>

    </div>

  );

}