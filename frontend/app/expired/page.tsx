"use client";

import { useEffect, useState } from "react";

export default function ExpiredMembers(){

const [members,setMembers] = useState<any[]>([]);

useEffect(()=>{

fetch("http://localhost:5000/api/members/expired")
  .then(res => res.json())
  .then(data => {
    console.log("Expired members:", data);

    if (Array.isArray(data)) {
      setMembers(data);
    } else {
      setMembers([]);
    }
  });

},[])

return(

<div className="p-10 text-white">

<h1 className="text-3xl font-bold mb-6">
Expired Members
</h1>

<table className="w-full text-center border">

<thead className="bg-gray-800">

<tr>
<th className="p-3">Name</th>
<th className="p-3">Phone</th>
<th className="p-3">Plan</th>
<th className="p-3">Expiry</th>
<th className="p-3">Actions</th>
</tr>

</thead>

<tbody>

{members?.map((m)=>(
<tr key={m._id}>

<td className="p-3">{m.name}</td>
<td className="p-3">{m.phone}</td>
<td className="p-3">{m.planType}</td>
<td className="p-3">
{new Date(m.expiryDate).toLocaleDateString()}
</td>

<td className="p-3 space-x-2">

<button className="bg-yellow-500 px-3 py-1 rounded">
Renew
</button>

<button className="bg-red-500 px-3 py-1 rounded">
Delete
</button>

</td>

</tr>
))}

</tbody>

</table>

</div>

)

}