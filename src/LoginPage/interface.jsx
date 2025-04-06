import { useState } from "react"
function Interface(){
   
        const annaunivlogo = "/annaunivlogo.jpg";
        const name = "SaravanaKumar B";
        const [sidebarOpen, setSidebarOpen] = useState(false);
        const [logoutSidebarOpen, setLogoutSidebarOpen] = useState(false);
      
        // const feeDetails = [
        //   {
        //     description: "Semester 3",
        //     amount: "₹50,000",
        //     lateFee: "₹500",
        //     reAdmFee: "₹1,000",
        //     penalty: "₹0",
        //     totalAmt: "₹51,500",
        //     paidOn: "2024-01-10",
        //     status: "Paid",
        //     receipt: "Download",
        //   },
        //   {
        //     description: "Semester 2",
        //     amount: "₹5,000",
        //     lateFee: "₹200",
        //     reAdmFee: "₹0",
        //     penalty: "₹0",
        //     totalAmt: "₹5,200",
        //     paidOn: "2024-02-05",
        //     status: "Paid",
        //     receipt: "Download",
        //   },
        //   {
        //     description: "Semester 1",
        //     amount: "₹40,000",
        //     lateFee: "₹1,000",
        //     reAdmFee: "₹2,000",
        //     penalty: "₹500",
        //     totalAmt: "₹43,500",
        //     paidOn: "Pending",
        //     status: "Pending",
        //     receipt: "-",
        //   },
        // ];
      
        return (
          <>
           <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#07899d] to-[#22d3ee] shadow-lg rounded-md">
              <div className="flex items-center gap-4">
                <img src={annaunivlogo} alt="Anna Univ Logo" className="w-12 h-12 rounded-full" />
                <h1 className="text-white text-lg font-bold">Fee Payment</h1>
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white text-2xl">&#9776;</button>
              </div>
              <div className="relative">
                <div className="flex items-center gap-3">
                  <img src={annaunivlogo} alt="Profile" className="w-10 h-10 rounded-full" />
                  <div>
                    <h4 className="text-white text-sm font-medium">{name}</h4>
                    <button onClick={() => setLogoutSidebarOpen(!logoutSidebarOpen)} className="bg-white text-black px-3 py-1 text-sm rounded-md">&#9660;</button>
                  </div>
                </div>
                {logoutSidebarOpen && (
                  <div className="absolute right-0 mt-2 bg-white text-black rounded-md shadow-lg p-2">
                    <button onClick={() => setLogoutSidebarOpen(false)} className="block w-full text-left px-4 py-2 hover:bg-gray-200">Log Out</button>
                  </div>
                )}
              </div>
            </div>
      
            <div className={`fixed top-0 left-0 w-64 h-full bg-gradient-to-r from-teal-700 to-cyan-400 text-white p-5 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300`}>
              <button onClick={() => setSidebarOpen(false)} className="text-xl">&times;</button>
              <div className="mt-5 flex flex-col gap-3">
                {["Dashboard", "Circular", "Attendance", "Contact", "Time Table", "Course Enroll"].map((item) => (
                  <button key={item} className="bg-white text-blue-800 p-2 rounded-md hover:bg-blue-200">{item}</button>
                ))}
              </div>
            </div>
      
            <div className="container mx-auto mt-8 p-4 max-w-4xl">
              <h3 className="text-lg font-bold text-center mb-4">Fee Details</h3>
              <div className="overflow-x-auto" style={{ minHeight: "calc(100% + 100px)" }}>
              
              </div>
            </div>
         </>
   );
}

export default Interface;