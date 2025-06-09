// Faculty Registration Component: Handles faculty user registration with form validation
// Features: Password confirmation, field validation, and secure API integration

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function FacultyRegister() {
  const [formData, setFormData] = useState({
    fullName: "", facultyId: "", department: "", email: "", password: "", confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    if (error) setError("");
    // Keep success message visible until next interaction maybe? Or clear here too.
    // if (success) setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError(""); setSuccess(""); setIsSubmitting(true);
    const { password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    console.log("Submitting Faculty Registration Data:", formData);
    try {
      const modifiedFormData = {
        id: formData.facultyId, // Map frontend field to backend 'id'
        name: formData.fullName, // Map frontend field to backend 'name'
        department: formData.department,
        email: formData.email,
        password: formData.password,
      };
      // Basic frontend validation before sending
      if (!modifiedFormData.id || !modifiedFormData.name || !modifiedFormData.department || !modifiedFormData.email || !modifiedFormData.password) {
         throw new Error("All fields are required.");
      }

      const res = await axios.post("http://localhost:5000/api/faculty", modifiedFormData);
      console.log(res.data);
      setSuccess("Faculty registration successful!");
      setFormData({ fullName: "", facultyId: "", department: "", email: "", password: "", confirmPassword: "" });
      alert("Registration successful!");
      navigate(`/faculty_dashboard/${modifiedFormData.id}`); // Use facultyId/id

    } catch (apiError) {
      console.error("API Error:", apiError);
      setError(apiError.response?.data?.message || apiError.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Apply dark gradient background, centering, and padding
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-indigo-950 to-teal-900 py-10 px-4">
      {/* Apply frosted glass effect, padding, rounded corners, shadow, max-width, and ring */}
      <div className="bg-gray-900/70 backdrop-blur-md p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md ring-1 ring-purple-400/30">
        {/* Gradient text title */}
        <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-teal-400 text-3xl font-bold mb-8 text-center">
          Faculty Registration
        </h2>

        {/* Display Error and Success Messages (Styled for dark theme) */}
        {error && <p className="bg-red-900/50 border border-red-500/50 text-red-300 p-3 rounded mb-4 text-center text-sm">{error}</p>}
        {success && <p className="bg-green-900/50 border border-green-500/50 text-green-300 p-3 rounded mb-4 text-center text-sm">{success}</p>}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Input Group Styling */}
          {[
            { label: "Full Name", name: "fullName", type: "text", placeholder: "Enter full name" },
            { label: "Faculty ID", name: "facultyId", type: "text", placeholder: "Enter faculty ID" },
            { label: "Department", name: "department", type: "text", placeholder: "Enter department" },
            { label: "Email", name: "email", type: "email", placeholder: "Enter email address" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-indigo-200 text-sm font-medium mb-1">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 bg-gray-800/70 text-white rounded-lg outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-400 text-base placeholder-gray-500 border border-transparent shadow-sm"
                placeholder={field.placeholder}
                required
                disabled={isSubmitting || !!success}
              />
            </div>
          ))}

          {/* Password Input */}
          <div className="relative">
            <label className="block text-indigo-200 text-sm font-medium mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 bg-gray-800/70 text-white rounded-lg outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-400 text-base placeholder-gray-500 border border-transparent pr-10" // Added pr-10
              placeholder="Enter password"
              required
              disabled={isSubmitting || !!success}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-sm leading-5 text-gray-400 hover:text-teal-300 transition-colors duration-200 disabled:opacity-50" // Adjusted top
              disabled={isSubmitting || !!success}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <label className="block text-indigo-200 text-sm font-medium mb-1">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 bg-gray-800/70 text-white rounded-lg outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-400 text-base placeholder-gray-500 border border-transparent pr-10" // Added pr-10
              placeholder="Confirm password"
              required
              disabled={isSubmitting || !!success}
            />
             <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-sm leading-5 text-gray-400 hover:text-teal-300 transition-colors duration-200 disabled:opacity-50" // Adjusted top
              disabled={isSubmitting || !!success}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white font-semibold py-2.5 text-lg rounded-lg transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg mt-8 ${isSubmitting || success ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={isSubmitting || !!success}
          >
            {isSubmitting ? 'Registering...' : 'Register Faculty'}
          </button>

           {/* Navigation Buttons */}
           <div className="text-center mt-5 space-x-4">
             <button type="button" className="text-teal-300 hover:text-teal-100 hover:underline text-sm transition-colors duration-200" onClick={() => navigate("/login")}> Go to Login </button>
             <button type="button" className="text-teal-300 hover:text-teal-100 hover:underline text-sm transition-colors duration-200" onClick={() => navigate("/registeroptions")}> More Options </button>
           </div>
        </form>
      </div>
    </div>
  );
}
export default FacultyRegister;