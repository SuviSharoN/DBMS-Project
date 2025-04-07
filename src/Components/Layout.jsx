// src/Components/Layout.js
import { useState } from "react";
import { useNavigate, Link, Outlet } from 'react-router-dom'; // Import Outlet

function Layout() {
  const navigate = useNavigate();
  const annaunivlogo = "/annaunivlogo.jpg"; // Ensure this path is correct (usually relative to public folder)
  const name = "SaravanaKumar B"; // Replace with dynamic data if needed
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutSidebarOpen, setLogoutSidebarOpen] = useState(false);

  // --- Handle Logout ---
  const handleLogout = () => {
    const isConfirmed = window.confirm("Are you sure you want to sign out?");
    if (isConfirmed) {
      console.log("Signing out confirmed...");
      setLogoutSidebarOpen(false);
      // TODO: Add actual sign-out logic (clear tokens, state, etc.)
      navigate('/login'); // Navigate to login page
    } else {
      console.log("Sign out cancelled.");
    }
  };

  // --- Define Sidebar Items with Paths based on App.js ---
  // IMPORTANT: These paths MUST match your Route paths in App.js
  const sidebarItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Circular", path: "/dashboard/circular" }, // Use the nested path
    { label: "Attendance", path: "/dashboard/attendance" }, // Use the nested path
    { label: "Fee Payment", path: "/dashboard/fee" }, // Use the nested path
    { label: "Contact", path: "/dashboard/contact" }, // Use the nested path
    { label : "Course Enroll", path : "/dashboard/course-enroll"},
    { label : "Time Table", path : "/dashboard/timetable"}
    // Add other items like Time Table, Course Enroll if you have routes for them
    // { label: "Time Table", path: "/dashboard/timetable" },
    // { label: "Course Enroll", path: "/dashboard/course-enroll" },
  ];

  return (
    <div className="min-h-screen flex flex-col"> {/* Ensure layout takes full height */}
      {/* --- Header --- */}
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#07899d] to-[#22d3ee] shadow-lg rounded-md sticky top-0 z-30"> {/* Make header sticky */}
        <div className="flex items-center gap-4">
          <img src={annaunivlogo} alt="Anna Univ Logo" className="w-12 h-12 rounded-full" />
          {/* Maybe show current page title dynamically later */}
          {/* <h1 className="text-white text-lg font-bold">App Name</h1> */}
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
            <img src={annaunivlogo} alt="Profile" className="w-10 h-10 rounded-full" />
            <div>
              <h4 className="text-white text-sm font-medium">{name}</h4>
              <button onClick={() => setLogoutSidebarOpen(!logoutSidebarOpen)} className="bg-white text-black px-3 py-1 text-sm rounded-md">▼</button>
            </div>
          </div>
          {logoutSidebarOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white text-black rounded-md shadow-lg p-2 z-40"> {/* Higher z-index */}
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-200 text-sm"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1"> {/* Allow content area to grow */}
        {/* --- Sidebar --- */}
        <div
          className={`fixed top-0 left-0 w-64 h-full bg-gradient-to-r from-teal-700 to-cyan-400 text-white p-5 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out z-20 pt-20`} // Add padding-top to account for sticky header
        >
          {/* Close Button inside sidebar */}
          <button onClick={() => setSidebarOpen(false)} className="text-2xl absolute top-4 right-4 hover:text-gray-300 md:hidden"> {/* Hide close button on larger screens if sidebar is part of layout */}
            ×
          </button>
          {/* Navigation Links */}
          <div className="mt-5 flex flex-col gap-4"> {/* Adjust margin if needed */}
            {sidebarItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setSidebarOpen(false)} // Close sidebar on mobile click
                className="block bg-white text-blue-800 p-3 rounded-md hover:bg-blue-100 text-center font-medium shadow-sm transition-colors duration-150"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* --- Main Content Area --- */}
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-10 md:hidden" // Only show overlay on smaller screens
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Outlet renders the matched child route component */}
        <main className={`flex-1 p-4 transition-all duration-300 ease-in-out ${sidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
             {/* Add pt-16 or similar if header is fixed/sticky to prevent content overlap */}
             {/* The actual page content (Dashboard, Circular, etc.) will be rendered here */}
             <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;