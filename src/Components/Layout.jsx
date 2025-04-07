// src/Components/Layout.js
import { useState } from "react";
// Import useNavigate, Link, Outlet (useNavigate is needed for the back button)
import { useNavigate, Link, Outlet } from 'react-router-dom';

function Layout() {
  const navigate = useNavigate(); // Keep useNavigate for back button
  const annaunivlogo = "/annaunivlogo.jpg";
  const name = "SaravanaKumar B";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutSidebarOpen, setLogoutSidebarOpen] = useState(false);

  // --- Handle Logout ---
  const handleLogout = () => {
    const isConfirmed = window.confirm("Are you sure you want to sign out?");
    if (isConfirmed) {
      console.log("Signing out confirmed...");
      setLogoutSidebarOpen(false);
      navigate('/login');
    } else {
      console.log("Sign out cancelled.");
    }
  };

  // --- Handle Go Back ---
  const handleGoBack = () => {
    navigate(-1); // Go back one step in browser history
  };

  // --- Sidebar Items ---
  const sidebarItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Circular", path: "/dashboard/circular" },
    { label: "Attendance", path: "/dashboard/attendance" },
    { label: "Fee Payment", path: "/dashboard/fee" },
    { label: "Contact", path: "/dashboard/contact" },
    { label : "Course Enroll", path : "/dashboard/course-enroll"},
    { label : "Time Table", path : "/dashboard/timetable"}
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* --- Header --- */}
      {/* Adjusted padding to p-3 for slightly less height */}
      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-[#07899d] to-[#22d3ee] shadow-lg rounded-md sticky top-0 z-30">
        {/* Left Side: Back Button, Logo, Hamburger */}
        <div className="flex items-center gap-3"> {/* Reduced gap slightly */}

          {/* --- ADDED BACK BUTTON --- */}
          <button
            onClick={handleGoBack}
            className="text-white p-2 rounded-full hover:bg-white/20 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Go back"
          >
            {/* Simple SVG Back Arrow */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}> {/* Slightly thicker stroke */}
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          {/* --- END BACK BUTTON --- */}

          <img src={annaunivlogo} alt="Anna Univ Logo" className="w-10 h-10 md:w-12 md:h-12 rounded-full" /> {/* Adjusted size slightly */}

          {/* Hamburger Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white text-2xl focus:outline-none"
          >
            ☰
          </button>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <div className="flex items-center gap-3">
            <img src={annaunivlogo} alt="Profile" className="w-9 h-9 md:w-10 md:h-10 rounded-full" /> {/* Adjusted size slightly */}
            <div>
              <h4 className="text-white text-sm font-medium">{name}</h4>
              <button onClick={() => setLogoutSidebarOpen(!logoutSidebarOpen)} className="bg-white text-black px-2.5 py-0.5 text-xs rounded-md shadow-sm hover:bg-gray-100">▼</button> {/* Adjusted size/padding */}
            </div>
          </div>
          {logoutSidebarOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white text-black rounded-md shadow-lg p-1.5 z-40 border border-gray-200"> {/* Added border, adjusted padding */}
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-1.5 hover:bg-red-50 hover:text-red-700 rounded text-sm text-red-600" // Adjusted padding, added red text
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- Main Body (Sidebar + Content) --- */}
      <div className="flex flex-1">
        {/* --- Sidebar --- */}
        {/* No changes to sidebar functionality or classes */}
        <div
          className={`fixed top-0 left-0 w-64 h-full bg-gradient-to-r from-teal-700 to-cyan-400 text-white p-5 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out z-20 pt-20`}
        >
          <button onClick={() => setSidebarOpen(false)} className="text-2xl absolute top-4 right-4 hover:text-gray-300 md:hidden">
            ×
          </button>
          <div className="mt-5 flex flex-col gap-4">
            {sidebarItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className="block bg-white text-blue-800 p-3 rounded-md hover:bg-blue-100 text-center font-medium shadow-sm transition-colors duration-150"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* --- Main Content Area --- */}
        {/* No changes to main content area classes */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-10 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
        <main className={`flex-1 p-4 transition-all duration-300 ease-in-out ${sidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
             {/* Optional: Add padding-top if content overlaps header */}
             {/* <div className="pt-16"> */}
                <Outlet />
             {/* </div> */}
        </main>
      </div>
    </div>
  );
}

export default Layout;