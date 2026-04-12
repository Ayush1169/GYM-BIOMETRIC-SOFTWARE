"use client";

import { useEffect, useState } from "react";

export default function Attendance() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/members/attendance")
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Attendance History</h1>

      <table className="w-full border text-center">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Entry Time</th>
          </tr>
        </thead>
        <tbody>
          {data.map((a) => (
            <tr key={a._id} className="border-t">
              <td className="p-3">{a.memberId?.name}</td>
              <td className="p-3">{a.memberId?.phone}</td>
              <td className="p-3">
                {new Date(a.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
