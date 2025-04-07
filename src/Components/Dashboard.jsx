import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const annaunivlogo = "/annaunivlogo.jpg"; // Image from the public folder

  const studentInfo = [
    { label: "Name", value: "SaravanaKumar" },
    { label: "Age", value: 18 },
    { label: "Year", value: "3" },
    { label: "Email", value: "s4tech1234@gmail.com" },
    { label: "Department", value: "CSE" },
  ];

  const dashboardOptions = [
    { label: "Circular", path: "/dashboard/circular" },
    { label: "Contact", path: "/dashboard/contact" },
    { label: "Fee", path: "/dashboard/fee" },
    { label: "Attendance", path: "/dashboard/attendance" },
    { label: "Time Table", path: "/dashboard/timetable" },
    { label: "Course Enroll", path: "/dashboard/course-enroll" },
  ];

  const handleSignOut = () => {
    const isConfirmed = window.confirm("Are you sure you want to sign out?");
    if (isConfirmed) {
      console.log("Signing out confirmed...");
      navigate('/login');
    } else {
      console.log("Sign out cancelled.");
    }
  };

  return (
    <div className="relative flex flex-col items-center py-12 min-h-screen bg-gray-100">
      {/* Sign Out Button */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white py-2 px-5 md:py-3 md:px-6 rounded-lg text-base md:text-lg font-semibold shadow-md hover:bg-red-600 hover:scale-105 transition-all duration-300"
        >
          Sign Out
        </button>
      </div>

      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10 text-center px-4">Student Dashboard</h2>

      {/* Main content card */}
      <div className="flex flex-col md:flex-row bg-white shadow-xl border border-gray-200 p-4 md:p-8 rounded-xl w-full max-w-5xl mx-4">

        {/* Left Section: Student Info */}
        <div className="w-full md:w-1/2 flex flex-col items-center p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-300 mb-6 md:mb-0">
          <div className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-gray-300 shadow-lg mb-6 flex-shrink-0">
            <img src={annaunivlogo} alt="Student Profile" className="w-full h-full object-cover" />
          </div>
          <div className="text-left w-full">
            <h3 className="text-xl md:text-2xl font-semibold text-gray-700 mb-4 text-center md:text-left">Student Information</h3>
            {studentInfo.map((item, index) => (
              <p key={index} className="text-base md:text-lg text-gray-600 mb-1 break-words">
                <span className="font-medium text-gray-800">{item.label}:</span> {item.value}
              </p>
            ))}
          </div>
        </div>

        {/* Right Section: Navigation Buttons */}
        {/* Added mt-[400px] to push the entire button block down */}
        {/* NOTE: 400px is a very large margin! */}
        <div className="w-full md:w-1/2 flex flex-wrap justify-center items-center content-start gap-4 md:gap-6 px-4 md:px-6 pb-6 pt-6 mt-[100px]">
          {dashboardOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => navigate(option.path)}
              className="w-full sm:w-48 bg-gradient-to-r from-blue-400 to-blue-600 text-white py-3 px-4 md:px-6 rounded-lg text-base md:text-lg font-semibold shadow-md hover:scale-105 hover:from-blue-500 hover:to-blue-700 transition-all duration-300"
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