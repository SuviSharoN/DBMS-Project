import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const iphone = "/iphone.jpg"; // Image from the public folder

  // --- Static Data (Replace with dynamic data later) ---
  const studentInfo = [
    { label: "Name", value: "SaravanaKumar" },
    { label: "Age", value: 18 },
    { label: "Year", value: "3" },
    { label: "Email", value: "s4tech1234@gmail.com" },
    { label: "Department", value: "CSE" },
  ];

  // Define navigation options with labels and target paths
  const dashboardOptions = [
    { label: "Circular", path: "/dashboard/circular" },
    { label: "Contact", path: "/dashboard/contact" },
    { label: "Fee", path: "/dashboard/fee" },
    { label: "Attendance", path: "/dashboard/attendance" },
    { label: "Time Table", path: "/dashboard/timetable" },
    { label: "Course Enroll", path: "/dashboard/course-enroll" },
  ];

  // --- Modified Handle Sign Out action ---
  const handleSignOut = () => {
    // 1. Show the confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to sign out?");

    // 2. Check if the user confirmed
    if (isConfirmed) {
      // TODO: Add actual sign-out logic here (e.g., clear tokens, reset state)
      console.log("Signing out confirmed...");
      navigate('/login'); // Navigate to the login page ONLY if confirmed
    } else {
      // Optional: Log if the user cancels
      console.log("Sign out cancelled.");
    }
  };

  return (
    <div className="relative flex flex-col items-center py-12 min-h-screen bg-gray-100">
      {/* Sign Out Button (Top Right) */}
      <div className="absolute top-6 right-6">
        <button
          onClick={handleSignOut} // This now triggers the confirmation first
          className="bg-red-500 text-white py-3 px-6 rounded-lg text-lg font-semibold shadow-md hover:bg-red-600 hover:scale-105 transition-all duration-300"
        >
          Sign Out
        </button>
      </div>

      <h2 className="text-4xl font-bold text-gray-800 mb-10">Student Dashboard</h2>

      <div className="flex flex-col md:flex-row bg-white shadow-xl border border-gray-300 p-8 rounded-xl w-full max-w-5xl">
        {/* Left Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center p-6 border-b md:border-b-0 md:border-r border-gray-300 mb-6 md:mb-0">
          <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-gray-400 shadow-lg mb-6">
            <img src={iphone} alt="Student Profile" className="w-full h-full object-cover" />
          </div>
          <div className="text-left w-full">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">Student Information</h3>
            {studentInfo.map((item, index) => (
              <p key={index} className="text-lg text-gray-600 mb-1">
                <span className="font-medium text-gray-900">{item.label}:</span> {item.value}
              </p>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 flex flex-wrap justify-center items-center content-start gap-6 p-6">
          {dashboardOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => navigate(option.path)} // Navigate to the defined path
              className="w-48 bg-gradient-to-r from-blue-400 to-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold shadow-md hover:scale-105 hover:from-blue-500 hover:to-blue-700 transition-all duration-300"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;