"use client";

import { useEffect, useState } from "react";

export default function Members() {
  const [members, setMembers] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [planMonths, setPlanMonths] = useState(1);
   const [fingerprintId, setFingerprintId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [search, setSearch] = useState("");
  const [age,setAge] = useState("")
  const [gender,setGender] = useState("male")
  const [amount, setAmount] = useState("");
  const [discount, setDiscount] = useState("");

  const filteredMembers = members.filter((m) =>
  m.name.toLowerCase().includes(search.toLowerCase()) ||
  m.phone.includes(search)
);


  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const res = await fetch("http://localhost:5000/api/members");
    const data = await res.json();
    setMembers(data);
  };

  // Add Member
  const addMember = async () => {
    if (!name || !phone) return alert("All fields required");

    const res = await fetch("http://localhost:5000/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, age, gender, planMonths,fingerprintId, paymentMethod, amount, discount }),
    });

    if (res.ok) {
      setName("");
      setPhone("");
      setAge("");
      setGender("male");
      setPlanMonths(1);
      fetchMembers();
    }
  };

  // Delete Member
  const deleteMember = async (id: string) => {
    if (!confirm("Are you sure?")) return;

    await fetch(`http://localhost:5000/api/members/${id}`, {
      method: "DELETE",
    });

    fetchMembers();
  };

  // Renew Plan
  const renewMember = async (id: string) => {
    const months = prompt("Enter months to renew (1,3,6):");
    if (!months) return;

    await fetch(`http://localhost:5000/api/members/${id}/renew`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planMonths: Number(months) }),
    });

    fetchMembers();
  };

const generateInvoice = async (member: any) => {

  try {

    const res = await fetch(
      "http://localhost:5000/api/invoices",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({

          memberId: member._id,

          name: member.name,

          phone: member.phone,

          planType: member.planType,

          originalAmount: member.price,

          discount: member.discount || 0,

          finalAmount:
            member.finalAmount || member.price,

          paymentMethod:
            member.paymentMethod || "cash"

        }),

      }
    );

    // ✅ CHECK ERROR FIRST
    if (!res.ok) {

      const errorText =
        await res.text();

      console.log(errorText);

      alert("Invoice Failed ❌");

      return;

    }

    // ✅ PDF BLOB
    const blob =
      await res.blob();

    // ✅ CREATE URL
    const url =
      window.URL.createObjectURL(blob);

    // ✅ DOWNLOAD LINK
    const a =
      document.createElement("a");

    a.href = url;

    a.download =
      `${member.name}-invoice.pdf`;

    document.body.appendChild(a);

    // ✅ AUTO DOWNLOAD
    a.click();

    document.body.removeChild(a);

    // ✅ CLEAN MEMORY
    window.URL.revokeObjectURL(url);

    alert("Invoice Downloaded ✅");

  } catch (err) {

    console.log(err);

    alert("Server Error ❌");

  }

};

  const startEnroll = async (memberId)=>{

try{

const res = await fetch(
"http://localhost:5000/api/biometric/start-enroll",
{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({memberId})
}
)

const data = await res.json()

if(res.ok){
alert("Ask member to place finger on biometric device")
}else{
alert("Device error")
}

}catch(err){

alert("Server not reachable")

}

}

//     const syncFingerprints = async ()=>{

// const res = await fetch("http://localhost:5000/api/biometric/sync")

// const data = await res.json()

// alert("Device users synced")

// fetchMembers()

// }
//    const syncDeviceUsers = async () => {

//   const res = await fetch("http://localhost:5000/api/biometric/users")

//   const data = await res.json()

//   console.log("Device Users:", data)

//   alert("Device users fetched. Check console.")
// }

  // Manual Attendance (Biometric Simulation)
  const markAttendance = async (id: string) => {
    const res = await fetch(
      "http://localhost:5000/api/members/attendance",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId: id }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      alert("Entry Allowed ✅");
    } else {
      alert(data.error || "Access Denied ❌");
    }
  };

  return (
    <div className="p-10">
      <h1 className="bg-[#0f172a] text-white border border-gray-600 p-3 rounded placeholder:text-gray-400">Members</h1>

      {/* Add Member Form */}
      <div className="grid grid-cols-4 gap-4 mb-6">

<input
placeholder="Name"
value={name}
onChange={(e)=>setName(e.target.value)}
className="bg-[#0f172a] text-white border border-gray-600 p-3 rounded placeholder:text-gray-400"
/>

<input
placeholder="Phone"
value={phone}
onChange={(e)=>setPhone(e.target.value)}
className="bg-[#0f172a] text-white border border-gray-600 p-3 rounded placeholder:text-gray-400"
/>

{ <input
placeholder="Fingerprint ID"
value={fingerprintId}
onChange={(e)=>setFingerprintId(e.target.value)}
className="bg-[#0f172a] text-white border border-gray-600 p-3 rounded placeholder:text-gray-400"
/> }

{/* <button
onClick={syncFingerprints}
className="bg-purple-600 px-4 py-2 rounded"
>
Sync Fingerprints
</button> */}



<input
placeholder="Search member..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="bg-[#0f172a] text-white border border-gray-600 p-3 rounded placeholder:text-gray-400"
/>

<input
placeholder="Age"
value={age}
onChange={(e)=>setAge(e.target.value)}
className="bg-[#0f172a] text-white border border-gray-600 p-3 rounded placeholder:text-gray-400"
/>



<select
value={gender}
onChange={(e)=>setGender(e.target.value)}
className="bg-[#0f172a] text-white border border-gray-600 p-3 rounded placeholder:text-gray-400"
>

<option value="male">Male</option>
<option value="female">Female</option>
<option value="other">Other</option>

</select>

<select
value={planMonths}
onChange={(e)=>setPlanMonths(Number(e.target.value))}
className="bg-[#0f172a] text-white border border-gray-600 p-3 rounded placeholder:text-gray-400"
>

<option value={1}>1 Month</option>
<option value={3}>3 Months</option>
<option value={6}>6 Months</option>

</select>

<input
placeholder="Amount"
value={amount}
onChange={(e)=>setAmount(e.target.value)}
className="bg-[#0f172a] text-white border border-gray-600 p-3 rounded placeholder:text-gray-400"
/>

<input
placeholder="Discount %"
value={discount}
onChange={(e)=>setDiscount(e.target.value)}
className="bg-[#0f172a] text-white border border-gray-600 p-3 rounded placeholder:text-gray-400"
/>

<select
value={paymentMethod}
onChange={(e)=>setPaymentMethod(e.target.value)}
className="bg-[#0f172a] text-white border border-gray-600 p-3 rounded placeholder:text-gray-400"
>

<option value="cash">Cash</option>
<option value="online">Online</option>

</select>

<div className="mt-4">

<button
onClick={addMember}
className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold"
>

Add Member

</button>

</div>

</div>

      {/* Members Table */}
      <table className="w-full min-w-[900px] border-gray-700 rounded-lg overflow-hidden">
        <thead className="bg-[#1e293b] text-gray-300">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Plan</th>
            <th className="p-3">Expiry</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
    

          {filteredMembers.map((m) => (
            <tr key={m._id} className="border-t">
              <td className="p-3">
                <a
                href={`/members/${m._id}`}
                className="text-cyan-400 cursor-pointer"
                 >
               {m.name}
                </a>
                </td>
              <td className="p-3">{m.phone}</td>
              <td className="p-3">{m.planType}</td>
              <td className="p-3">
                {new Date(m.expiryDate).toLocaleDateString()}
              </td>
              <td className="p-3">
                <span
                  className={`px-3 py-1 rounded text-white ${
                    m.status === "active"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {m.status}
                </span>
              </td>

              {/* Actions */}
              <td className="p-3 flex gap-2 justify-center">

                
                <button
                  onClick={() => markAttendance(m._id)}
                  className="bg-green-500 px-3 py-1 rounded text-sm"
                >
                  Entry
                </button>

                <button
onClick={()=>startEnroll(m._id)}
className="bg-purple-600 text-sm px-3 py-1 rounded"
>
Enroll
</button>

                <button
                  onClick={() => renewMember(m._id)}
                  className="bg-yellow-500 text-sm px-3 py-1 rounded"
                >
                  Renew
                </button>

                <button
  onClick={() => generateInvoice(m)}
  className="bg-indigo-600 text-sm px-3 py-1 rounded"
>
  Invoice
</button>

                <button
                  onClick={() => deleteMember(m._id)}
                  className="bg-red-600 text-sm px-3 py-1 rounded"
                >
                  Archive
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
