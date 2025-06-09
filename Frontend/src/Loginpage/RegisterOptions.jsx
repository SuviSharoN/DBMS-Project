// Registration Options Component: Provides role-based registration selection interface
// Features: Student, Admin, and Faculty registration options with intuitive navigation

import React from "react";
import { useNavigate } from "react-router-dom";

function RegisterOptions() {
  const navigate = useNavigate();

  const handleStudentRegistration = () => {
    navigate("/student-register"); // Ensure these routes exist in your App router
  };

  const handleAdminRegistration = () => {
    navigate("/admin-register"); // Ensure these routes exist in your App router
  };

  const handleFacultyRegistration = () => {
    navigate("/faculty-register"); // Ensure these routes exist in your App router
  };

  return (
    // Use the same background gradient as the Login page
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-black via-indigo-950 to-teal-900">
      {/* Use similar frosted glass effect, padding, shadow, rounded corners, and ring */}
      <div className="bg-gray-900/60 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-96 text-center transform transition-transform duration-300 hover:scale-[1.02] ring-1 ring-purple-400/30">
        {/* Use similar gradient text for the title */}
        <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-teal-400 text-3xl font-bold mb-8"> {/* Increased bottom margin */}
          Choose Registration Type
        </h2>

        {/* Use similar button styling - maybe different gradient for distinction? */}
        {/* Option 1: Same gradient as Login's primary button */}
         <button
          type="button"
          className="bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white py-3 rounded-lg w-full text-xl font-semibold transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg mb-6" // Added bottom margin
          onClick={handleStudentRegistration}
        >
          Register as Student
        </button>

        {/* Option 2: Slightly different gradient */}
         <button
           type="button"
           className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white py-3 rounded-lg w-full text-xl font-semibold transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg mb-6" // Added bottom margin
           onClick={handleAdminRegistration}
         >
           Register as Admin
         </button>

         <button
           type="button"
           // Using the same gradient again, or choose another
           className="bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white py-3 rounded-lg w-full text-xl font-semibold transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
           onClick={handleFacultyRegistration}
         >
           Register as Faculty
         </button>

        {/* Optional: Add a subtle back button */}
        <button
            type="button"
            onClick={() => navigate('/login')} // Go back to login
            className="mt-8 text-sm text-teal-300 hover:text-teal-100 hover:underline transition-colors duration-200"
        >
            ← Back to Login
        </button>

      </div>
    </div>
  );
}

export default RegisterOptions;