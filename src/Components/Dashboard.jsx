// src/Components/Dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
// --- REMOVED: react-icons import ---

function Dashboard() {
  const navigate = useNavigate();
  const annaunivlogo = "/annaunivlogo.jpg"; // Image from the public folder

  // --- Static Data (Replace with dynamic data from context/API) ---
  const studentInfo = {
    name: "SaravanaKumar B",
    age: 18,
    year: "2nd Year",
    email: "s4tech1234@gmail.com",
    department: "Computer Science & Engineering (CSE)",
    rollNumber: "2023103559",
  };

  // Define navigation options (without icons)
  const dashboardOptions = [
    { label: "Circulars", path: "/dashboard/circular" },
    { label: "Attendance", path: "/dashboard/attendance" },
    { label: "Fee Payments", path: "/dashboard/fee" },
    { label: "Timetable", path: "/dashboard/timetable" },
    { label: "Course Enrollment", path: "/dashboard/course-enroll" },
    { label: "Contact Info", path: "/dashboard/contact" },
  ];

  // Removed handleSignOut - Handled by Layout.js

  return (
    // Main container for dashboard content (assumes Layout provides outer structure)
    <div className="p-4 md:p-6 lg:p-8">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center md:text-left">
        Welcome, {studentInfo.name}!
      </h2>

      {/* Main content card using Grid for layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

        {/* Left Section: Student Profile Card (Spans 1 column on large screens) */}
        <div className="lg:col-span-1 bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-xl p-6 border border-gray-200 flex flex-col items-center">
          {/* Profile Image */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-cyan-200 shadow-lg mb-5 flex-shrink-0 ring-2 ring-cyan-400 ring-offset-2">
            <img src={annaunivlogo} alt="Student Profile" className="w-full h-full object-cover" />
          </div>
          {/* Info Details */}
          <div className="text-center w-full">
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-1">{studentInfo.name}</h3>
            <p className="text-sm text-cyan-700 font-medium mb-3">{studentInfo.department}</p>
            <div className="text-left w-full space-y-2 text-sm md:text-base border-t pt-4 mt-4">
              <p className="text-gray-600"><span className="font-semibold text-gray-700 w-20 inline-block">Roll No:</span> {studentInfo.rollNumber}</p>
              <p className="text-gray-600"><span className="font-semibold text-gray-700 w-20 inline-block">Year:</span> {studentInfo.year}</p>
              <p className="text-gray-600"><span className="font-semibold text-gray-700 w-20 inline-block">Email:</span> <span className="break-all">{studentInfo.email}</span></p>
              <p className="text-gray-600"><span className="font-semibold text-gray-700 w-20 inline-block">Age:</span> {studentInfo.age}</p>
            </div>
          </div>
        </div>

        {/* Right Section: Navigation Options (Spans 2 columns on large screens) */}
        <div className="lg:col-span-2 bg-white shadow-xl rounded-xl p-6 border border-gray-200">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-700 mb-6 border-b pb-3">Quick Actions</h3>
          {/* Grid layout for buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
            {dashboardOptions.map((option) => (
              <button
                key={option.label}
                onClick={() => navigate(option.path)}
                // Adjusted styling: removed flex-col, gap-2; adjusted padding
                className="p-4 md:p-5 rounded-lg text-center bg-gradient-to-r from-cyan-50 to-blue-100 text-blue-800 font-semibold shadow-md border border-blue-200 hover:shadow-lg hover:scale-[1.03] hover:from-cyan-100 hover:to-blue-200 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400"
              >
                {/* Label */}
                <span className="text-sm md:text-base">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;