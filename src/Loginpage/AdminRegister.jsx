import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation buttons

function AdminRegister() {
  // State for form fields
  const [formData, setFormData] = useState({
    fullName: "",
    adminId: "", // Changed from facultyId
    password: "",
    confirmPassword: "",
  });

  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State for messages and submission status
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate(); // Hook for navigation

  // Generic handler for input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Clear errors/success when user types again
    if (error) setError("");
    // if (success) setSuccess(""); // Keep success message until next submit attempt
  };

  // Handler for form submission
  const handleSubmit = async (e) => { // Make async for potential API calls
    e.preventDefault();
    if (isSubmitting) return; // Prevent double submission

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    const { fullName, adminId, password, confirmPassword } = formData;

    // --- Basic Validation ---
    if (!fullName || !adminId || !password || !confirmPassword) {
      setError("All fields are required.");
      setIsSubmitting(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }
    // Add more validation if needed (e.g., password complexity)

    // --- TODO: Replace with actual API call to backend ---
    console.log("Submitting Admin Registration Data:", formData);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess("Admin registration successful!");
      // Clear form on success
      setFormData({
        fullName: "", adminId: "", password: "", confirmPassword: ""
      });
      // No automatic navigation here

    } catch (apiError) {
      console.error("API Error:", apiError);
      setError(apiError.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false); // Re-enable button
    }
    // --- End of Placeholder ---
  };

  return (
    // Using the styling from the provided RegisterPage example
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-cyan-400 py-10">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Admin Registration</h2>

        {/* Display Error and Success Messages */}
        {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">{error}</p>}
        {success && <p className="bg-green-100 text-green-700 p-3 rounded mb-4 text-center">{success}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <label className="block text-gray-700 font-medium">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-300 outline-none"
              placeholder="Enter full name"
              required
              disabled={isSubmitting || !!success} // Disable on submit/success
            />
          </div>

          {/* Admin ID */}
          <div>
            <label className="block text-gray-700 font-medium">Admin ID</label>
            <input
              type="text"
              name="adminId" // Use adminId
              value={formData.adminId}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-300 outline-none"
              placeholder="Enter admin ID"
              required
              disabled={isSubmitting || !!success}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-300 outline-none pr-10"
              placeholder="Enter password"
              required
              disabled={isSubmitting || !!success}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-sm leading-5 text-gray-600 hover:text-gray-800 disabled:opacity-50"
              disabled={isSubmitting || !!success}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-gray-700 font-medium">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-300 outline-none pr-10"
              placeholder="Confirm password"
              required
              disabled={isSubmitting || !!success}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-sm leading-5 text-gray-600 hover:text-gray-800 disabled:opacity-50"
              disabled={isSubmitting || !!success}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition mt-6 ${isSubmitting || success ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitting || !!success}
          >
            {isSubmitting ? 'Registering...' : 'Register Admin'}
          </button>

           {/* Navigation Buttons (Optional) */}
           <div className="text-center mt-4 space-x-4">
             <button
                type="button"
                className="text-blue-600 hover:underline text-sm"
                onClick={() => navigate("/login")}
             >
                Go to Login
             </button>
             <button
                type="button"
                className="text-blue-600 hover:underline text-sm"
                onClick={() => navigate("/registeroptions")}
             >
                More Options
             </button>
           </div>

        </form>
      </div>
    </div>
  );
}

export default AdminRegister;