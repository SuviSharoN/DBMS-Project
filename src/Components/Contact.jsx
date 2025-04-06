import React, { useState } from 'react'; // Added React import for clarity
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate

function Contact() {
  const navigate = useNavigate(); // Instantiate useNavigate
  const annaunivlogo = "/annaunivlogo.jpg";
  const name = "SaravanaKumar B"; // Replace with dynamic data if needed
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutSidebarOpen, setLogoutSidebarOpen] = useState(false);

  // --- Navigation items for the sidebar ---
  const sidebarItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Circular", path: "/dashboard/circular" },
    { label: "Attendance", path: "/dashboard/attendance" },
    { label: "Contact", path: "/dashboard/contact" }, // Assuming contact is part of dashboard sections
    { label: "Time Table", path: "/dashboard/timetable" },
    { label: "Course Enroll", path: "/dashboard/course-enroll" },
  ];

  // --- Handle Logout with Confirmation ---
  const handleLogout = () => {
    const isConfirmed = window.confirm("Are you sure you want to log out?");
    if (isConfirmed) {
      // TODO: Add actual logout logic (clear tokens, etc.)
      console.log("Logout confirmed...");
      setLogoutSidebarOpen(false); // Close the dropdown first
      navigate('/login'); // Navigate to login page
    } else {
      console.log("Logout cancelled.");
    }
  };

  // --- Handle Sidebar Navigation ---
  const handleSidebarNavigate = (path) => {
    setSidebarOpen(false); // Close sidebar on navigation
    navigate(path);
  };


  return (
    <>
      {/* Header Section */}
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#07899d] to-[#22d3ee] shadow-lg rounded-md sticky top-0 z-20"> {/* Added sticky and z-index */}
        {/* Left Side: Logo, Title, Hamburger */}
        <div className="flex items-center gap-4">
          {/* Hamburger Button */}
          <button onClick={() => setSidebarOpen(true)} className="text-white text-2xl md:hidden"> {/* Hide on medium screens and up */}
            ☰
          </button>
          <img src={annaunivlogo} alt="Anna Univ Logo" className="w-12 h-12 rounded-full" />
          <h1 className="text-white text-lg font-bold">Contact</h1>
        </div>

        {/* Right Side: Profile Dropdown */}
        <div className="relative">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setLogoutSidebarOpen(!logoutSidebarOpen)}> {/* Make whole area clickable */}
            <img src={annaunivlogo} alt="Profile" className="w-10 h-10 rounded-full" />
            <div className="hidden md:block"> {/* Hide text on small screens */}
              <h4 className="text-white text-sm font-medium">{name}</h4>
            </div>
             {/* Dropdown Arrow */}
             <span className="text-white text-xs">▼</span>
          </div>

          {/* Logout Dropdown Content */}
          {logoutSidebarOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white text-black rounded-md shadow-lg p-1 z-30"> {/* Added z-index */}
              <button
                onClick={handleLogout} // Use the new handler
                className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-200 rounded"
              >
                Log Out
              </button>
              {/* Add other options like 'Profile' if needed */}
              {/* <button className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-200 rounded">Profile</button> */}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Section */}
      {/* Overlay for closing sidebar */}
      {sidebarOpen && (
         <div
            className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
         ></div>
      )}
      {/* Sidebar Content */}
      <div className={`fixed top-0 left-0 w-64 h-full bg-gradient-to-r from-teal-700 to-cyan-400 text-white p-5 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 z-40`}>
        {/* Close Button */}
        <button onClick={() => setSidebarOpen(false)} className="absolute top-3 right-3 text-2xl text-white hover:text-gray-300">×</button>

        {/* Sidebar Header (Optional) */}
        <div className="mb-6 mt-2">
           <img src={annaunivlogo} alt="Logo" className="w-16 h-16 mx-auto rounded-full mb-2"/>
           <p className="text-center text-sm font-semibold">{name}</p>
        </div>

        {/* Navigation Links */}
        <nav className="mt-5 flex flex-col gap-3">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleSidebarNavigate(item.path)} // Navigate on click
              className="bg-white/80 text-teal-900 p-2 rounded-md hover:bg-white transition duration-200 text-left font-medium"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className={`container mx-auto mt-8 p-4 max-w-4xl transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'ml-0'}`}> {/* Adjust margin when sidebar is open on md+ screens */}
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">Contact Us</h3>

        {/* Contact Info Box */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <p className="text-gray-700 mb-2 flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
             <strong>Email:</strong> <a href="mailto:s4tech1234@gmail.com" className="text-blue-600 hover:underline">s4tech1234@gmail.com</a>
          </p>
          <p className="text-gray-700 mb-2 flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
             <strong>Phone:</strong> <a href="tel:+919876543210" className="text-blue-600 hover:underline">+91 98765 43210</a>
          </p>
          <p className="text-gray-700 mb-2 flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
             <strong>Address:</strong> Anna University, Chennai - 600025
          </p>
        </div>

        {/* Contact Form */}
        {/* TODO: Add state and handlers for a functional form */}
        <form className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-xl font-bold mb-4 text-gray-800">Send a Message</h4>
          <div className="mb-4">
            <label htmlFor="contact-name" className="block text-gray-700 font-medium mb-1">Name</label>
            <input id="contact-name" type="text" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none" placeholder="Enter your name" />
          </div>
          <div className="mb-4">
            <label htmlFor="contact-email" className="block text-gray-700 font-medium mb-1">Email</label>
            <input id="contact-email" type="email" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none" placeholder="Enter your email" />
          </div>
          <div className="mb-4">
            <label htmlFor="contact-message" className="block text-gray-700 font-medium mb-1">Message</label>
            <textarea id="contact-message" rows="4" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none" placeholder="Enter your message"></textarea>
          </div>
          <button type="submit" className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold px-5 py-2 rounded-md hover:from-teal-600 hover:to-cyan-700 transition duration-200">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default Contact;