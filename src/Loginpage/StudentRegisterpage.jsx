import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

// Rename component for clarity
function StudentRegister() {
  // State for form fields - Added password fields
  const [formData, setFormData] = useState({
    fullName: "", // Renamed from 'name' for consistency
    regNo: "",
    email: "",
    password: "", // Added
    confirmPassword: "", // Added
    dob: "",
    gender: "",
    mobile: "",
    address: "",
    guardianPhone: "",
    guardianName: "",
    department: "", // Added department field
    year: "", // Added year field
    // Removed category, joiningDate, reservation, reservationType for simplicity,
    // Add them back if needed following the same pattern.
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
    // if (success) setSuccess(""); // Keep success message
  };

  // Handler for form submission
  const handleSubmit = async (e) => { // Make async for potential API calls
    e.preventDefault();
    if (isSubmitting) return; // Prevent double submission

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    const { password, confirmPassword } = formData; // Destructure passwords for check

    // --- Basic Validation ---
    // Check if any required field is empty (add all required fields here)
    const requiredFields = ['fullName', 'regNo', 'email', 'password', 'confirmPassword', 'dob', 'gender', 'mobile', 'address', 'guardianPhone', 'guardianName', 'department', 'year'];
    const missingField = requiredFields.find(field => !formData[field]);

    if (missingField) {
      // Capitalize first letter and add space before capital letters for display
      const fieldName = missingField.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      setError(`${fieldName} is required.`);
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }
    // Add more specific validation (e.g., email format, phone number pattern, password strength)

    // --- TODO: Replace with actual API call to backend ---
    console.log("Submitting Student Registration Data:", formData);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess("Student registration successful!");
      // Clear form on success
      setFormData({
        fullName: "", regNo: "", email: "", password: "", confirmPassword: "",
        dob: "", gender: "", mobile: "", address: "", guardianPhone: "",
        guardianName: "", department: "", year: ""
      });
      // No automatic navigation

    } catch (apiError) {
      console.error("API Error:", apiError);
      setError(apiError.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false); // Re-enable button
    }
    // --- End of Placeholder ---
  };

  return (
    // Using the consistent styling
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-cyan-400 py-10">
      {/* Increased max-w for more fields */}
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Student Registration</h2>

        {/* Display Error and Success Messages */}
        {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">{error}</p>}
        {success && <p className="bg-green-100 text-green-700 p-3 rounded mb-4 text-center">{success}</p>}

        {/* Use grid for better layout with more fields */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4" onSubmit={handleSubmit}>

          {/* Full Name */}
          <div>
            <label className="block text-gray-700 font-medium">Full Name</label>
            <input
              type="text"
              name="fullName" // Changed from 'name'
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-300 outline-none"
              placeholder="Enter full name"
              required
              disabled={isSubmitting || !!success}
            />
          </div>

          {/* Registration Number */}
          <div>
            <label className="block text-gray-700 font-medium">Registration Number</label>
            <input
              type="text"
              name="regNo"
              value={formData.regNo}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-300 outline-none"
              placeholder="Enter Reg No"
              required
              disabled={isSubmitting || !!success}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-300 outline-none"
              placeholder="Enter email address"
              required
              disabled={isSubmitting || !!success}
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-gray-700 font-medium">Mobile Number</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              pattern="[0-9]{10}" // Basic 10-digit pattern
              title="Please enter a 10-digit mobile number"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-300 outline-none"
              placeholder="Enter 10-digit mobile number"
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
              placeholder="Create a password"
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
              placeholder="Confirm your password"
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

          {/* Date of Birth */}
          <div>
            <label className="block text-gray-700 font-medium">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-300 outline-none"
              required
              disabled={isSubmitting || !!success}
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-700 font-medium">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-300 outline-none bg-white" // Added bg-white for select
              required
              disabled={isSubmitting || !!success}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Guardian's Name */}
          <div>
            <label className="block text-gray-700 font-medium">Guardian/Parent Name</label>
            <input
              type="text"
              name="guardianName"
              value={formData.guardianName}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-300 outline-none"
              placeholder="Enter guardian/parent name"
              required
              disabled={isSubmitting || !!success}
            />
          </div>

          {/* Guardian's Phone Number */}
          <div>
            <label className="block text-gray-700 font-medium">Guardian's Phone Number</label>
            <input
              type="tel"
              name="guardianPhone"
              value={formData.guardianPhone}
              onChange={handleChange}
              pattern="[0-9]{10}"
              title="Please enter a 10-digit mobile number"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-300 outline-none"
              placeholder="Enter guardian's phone number"
              required
              disabled={isSubmitting || !!success}
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-gray-700 font-medium">Department</label>
            <select // Changed to select for better UX
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-300 outline-none bg-white"
              required
              disabled={isSubmitting || !!success}
            >
              <option value="">Select Department</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
              {/* Add more departments as needed */}
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="block text-gray-700 font-medium">Current Year</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-300 outline-none bg-white"
              required
              disabled={isSubmitting || !!success}
            >
              <option value="">Select Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
              {/* Adjust if needed */}
            </select>
          </div>

          {/* Address - Spanning two columns */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3" // Set rows for textarea
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-300 outline-none"
              placeholder="Enter your full address"
              required
              disabled={isSubmitting || !!success}
            />
          </div>

          {/* Submit Button - Spanning two columns */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className={`w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition mt-4 ${isSubmitting || success ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitting || !!success}
            >
              {isSubmitting ? 'Registering...' : 'Register Student'}
            </button>
          </div>

           {/* Navigation Buttons - Spanning two columns */}
           <div className="md:col-span-2 text-center mt-2 space-x-4">
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

// Export with the new name
export default StudentRegister;