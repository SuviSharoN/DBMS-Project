import React from "react";
import { useNavigate } from "react-router-dom";

function RegisterOptions() {
  const navigate = useNavigate();

  const handleStudentRegistration = () => {
    navigate("/student-register");
  };

  const handleAdminRegistration = () => {
    navigate("/admin-register");
  };

  const handleFacultyRegistration = () => {
    navigate("/faculty-register");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-cyan-400">
      <div className="bg-white/20 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-96 text-center transform transition-transform duration-300 hover:scale-105">
        <h2 className="text-white text-3xl font-bold mb-6">Register Options</h2>
        <button
          type="button"
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg w-full text-xl font-semibold transition-transform duration-300 hover:scale-105 mb-5"
          onClick={handleStudentRegistration}
        >
          Student Registration
        </button>
        <button
          type="button"
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg w-full text-xl font-semibold transition-transform duration-300 hover:scale-105 mb-5"
          onClick={handleAdminRegistration}
        >
          Admin Registration
        </button>
        <button
          type="button"
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg w-full text-xl font-semibold transition-transform duration-300 hover:scale-105"
          onClick={handleFacultyRegistration}
        >
          Faculty Registration
        </button>
      </div>
    </div>
  );
}

export default RegisterOptions;