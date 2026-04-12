"use client";

import { useEffect, useState } from "react";


export default function ArchivedMembers() {

  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/members/archived")
      .then(res => res.json())
      .then(data => setMembers(data));
  }, []);

  // 🔥 Restore Member
  const restoreMember = async (id:any) => {

    const planMonths = prompt("Enter Plan Months (1,3,6,12)");

    if(!planMonths) return;

    await fetch(`http://localhost:5000/api/members/restore/${id}`,{
      method:"PUT",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        planMonths:Number(planMonths)
      })
    });

    window.location.reload();
  };

  // 🔥 Permanent Delete
  const deleteMember = async (id:any) => {

    const confirmDelete = confirm("Delete permanently?");

    if(!confirmDelete) return;

    await fetch(`http://localhost:5000/api/members/permanent/${id}`,{
      method:"DELETE"
    });

    window.location.reload();
  };

  return (
    <div className="p-10">

      <h1 className="text-3xl font-bold mb-6">
        Archived Members
      </h1>

      <table className="w-full border text-center">

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

          {members.map((m:any) => (
            <tr key={m._id} className="border-t">

              <td className="p-3">{m.name}</td>
              <td className="p-3">{m.phone}</td>
              <td className="p-3">{m.planType}</td>

              <td className="p-3">
                {new Date(m.expiryDate).toLocaleDateString()}
              </td>

              <td className="p-3 flex justify-center gap-3">

                <button
                  onClick={()=>restoreMember(m._id)}
                  className="bg-green-500 px-3 py-1 rounded"
                >
                  Restore
                </button>

                <button
                  onClick={()=>deleteMember(m._id)}
                  className="bg-red-500 px-3 py-1 rounded"
                >
                  Delete
                </button>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}