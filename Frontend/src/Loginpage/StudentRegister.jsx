// src/Pages/RegisterPage.jsx (or your actual path)
import React, { useState } from "react"; // Added React import
import { useNavigate } from "react-router-dom";
import axios from "axios";

function RegisterPage() { // Renamed component for clarity
  const [formData, setFormData] = useState({
    name: "",
    id: "", // Registration Number
    email: "",
    dob: "",
    gender: "",
    category: "",
    phone: "", // Mobile Number
    address: "",
    guardian_phone: "",
    guardian_name: "",
    department: "",
    year: "",
    joiningyear: "", // Year of Admission
    reservation: "No", // Default to 'No'
    reservationType: "",
    password: "",
    confirmPassword: "" // Added confirm password
  });

  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State for messages and submission status
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if(error) setError(""); // Clear error on change
    // Decide if you want to clear success on change too
    // if(success) setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double submission
    setError(""); setSuccess(""); setIsSubmitting(true);

    // --- Basic Validation ---
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }
    if (formData.reservation === "Yes" && !formData.reservationType) {
        setError("Please select a reservation type if reservation is 'Yes'.");
        setIsSubmitting(false);
        return;
    }
    // Add more frontend validation as needed (e.g., check required selects)


    try {
      // Prepare data for backend (ensure ID is integer, reservation is boolean)
      const modifiedFormData = {
        ...formData,
        id: parseInt(formData.id, 10), // Ensure ID is parsed as integer
        reservation: formData.reservation === "Yes", // Convert to boolean
        // Omit confirmPassword before sending to backend
        confirmPassword: undefined
      };
      delete modifiedFormData.confirmPassword; // Cleanly remove it

       // Check if ID parsing failed
       if (isNaN(modifiedFormData.id)) {
           throw new Error("Registration Number must be a valid number.");
       }
       // Add checks for other required fields if necessary
        if (!modifiedFormData.name || !modifiedFormData.email /* ... etc ... */) {
            throw new Error("Please fill out all required fields.");
        }


       console.log("Submitting Student Registration Data:", modifiedFormData);
       // Ensure endpoint /api/students is correct for POSTing new students
      const res = await axios.post("http://localhost:5000/api/students", modifiedFormData);

      console.log("Student added:", res.data);
      setSuccess("Registration successful! Redirecting..."); // Set success message
      alert("Registration successful!");

      // Optionally clear form immediately or wait for navigation
      // setFormData({ ...initial empty state... });

      // Navigate after a short delay to show success message
      setTimeout(() => {
          navigate(`/dashboard/${modifiedFormData.id}`); // Navigate using the submitted ID
      }, 1500);

    } catch (err) {
      console.error("Error:", err);
      // Extract error message more reliably
      const message = err.response?.data?.message || err.message || "Registration failed. Please check your details and try again.";
      setError(message);
      setIsSubmitting(false); // Re-enable button on error
    }
    // No finally block needed if success path navigates away
  };

  return (
    // Apply dark gradient background, centering, and padding
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-indigo-950 to-teal-900 py-10 px-4">
      {/* Top Right Login Button - Styled for dark theme */}
       <div className="absolute top-6 right-6 z-10">
         <button
            onClick={() => navigate('/login')}
            className="bg-transparent border border-teal-400 text-teal-300 hover:bg-teal-400/20 hover:text-teal-100 px-4 py-2 rounded-lg font-medium transition duration-200"
         >
           Login
         </button>
       </div>

      {/* Apply frosted glass effect, adjust max-width for longer form */}
      <div className="bg-gray-900/70 backdrop-blur-md p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-3xl ring-1 ring-purple-400/30"> {/* Increased max-w */}
        {/* Gradient text title */}
        <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-teal-400 text-3xl font-bold mb-8 text-center">
          Student Registration
        </h2>

        {/* Display Error and Success Messages (Styled for dark theme) */}
        {error && <p className="bg-red-900/50 border border-red-500/50 text-red-300 p-3 rounded mb-4 text-center text-sm">{error}</p>}
        {success && <p className="bg-green-900/50 border border-green-500/50 text-green-300 p-3 rounded mb-4 text-center text-sm">{success}</p>}

        {/* Use grid for better layout */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5" onSubmit={handleSubmit}>

          {/* Column 1 */}
          <div className="md:col-span-1 space-y-5">
             {/* Input Fields */}
             {[
                { label: "Full Name", name: "name", type: "text", placeholder: "Enter your name" },
                { label: "Registration Number", name: "id", type: "text", placeholder: "Enter your Reg No" },
                { label: "Mobile Number", name: "phone", type: "tel", placeholder: "10-digit mobile number", pattern:"[0-9]{10}" },
                { label: "Guardian/Parent Name", name: "guardian_name", type: "text", placeholder: "Enter guardian name" },
                { label: "Guardian's Phone", name: "guardian_phone", type: "tel", placeholder: "10-digit mobile", pattern:"[0-9]{10}" },
                { label: "Email", name: "email", type: "email", placeholder: "Enter your email" },
                { label: "Date of Birth", name: "dob", type: "date" },
             ].map(field => (
                 <div key={field.name}>
                    <label className="block text-indigo-200 text-sm font-medium mb-1">{field.label}</label>
                    <input
                        {...field} // Spread props like type, name, placeholder, pattern
                        value={formData[field.name]}
                        onChange={handleChange}
                        className="w-full px-4 py-2 mt-1 bg-gray-800/70 text-white rounded-lg outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-400 text-base placeholder-gray-500 border border-transparent shadow-sm"
                        required
                        disabled={isSubmitting || !!success} // Disable after success
                    />
                 </div>
             ))}
              {/* Address Textarea */}
             <div>
                <label className="block text-indigo-200 text-sm font-medium mb-1">Address</label>
                <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 mt-1 bg-gray-800/70 text-white rounded-lg outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-400 text-base placeholder-gray-500 border border-transparent shadow-sm resize-y"
                    placeholder="Enter your address"
                    required
                    disabled={isSubmitting || !!success}
                />
             </div>
          </div>

          {/* Column 2 */}
          <div className="md:col-span-1 space-y-5">
             {/* Select Fields */}
             {[
                { label: "Gender", name: "gender", options: ["", "Male", "Female", "Other"] },
                { label: "Category", name: "category", options: ["", "BC", "MBC", "OC", "SC", "ST"] },
                { label: "Department", name: "department", options: ["", "CSE", "ECE", "EEE", "MECH", "CIVIL"], displayOptions: ["Select Department", "Computer Science", "Electronics & Comm.", "Electrical & Electronics", "Mechanical", "Civil"] },
                { label: "Current Year", name: "year", options: ["", "1", "2", "3", "4"], displayOptions: ["Select Year", "1st Year", "2nd Year", "3rd Year", "4th Year"] },
                { label: "Year of Admission", name: "joiningyear", options: ["", "2021", "2022", "2023", "2024", "2025"] }, // Add more years if needed
             ].map(field => (
                <div key={field.name}>
                   <label className="block text-indigo-200 text-sm font-medium mb-1">{field.label}</label>
                   <select
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        className="w-full px-4 py-2 mt-1 bg-gray-800/70 text-white rounded-lg outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-400 text-base border border-transparent shadow-sm appearance-none" // Added appearance-none
                        required // Most selects should be required
                        disabled={isSubmitting || !!success}
                    >
                     {/* Use displayOptions if provided, otherwise use options */}
                     {(field.displayOptions || field.options).map((option, index) =>
                       <option key={option} value={field.options[index]} disabled={index === 0}>
                         {option} {index === 0 ? "" : ""} {/* Add default text if needed */}
                       </option>
                     )}
                   </select>
                 </div>
             ))}

             {/* Reservation Radio Buttons */}
             <div>
                 <label className="block text-indigo-200 text-sm font-medium mb-1">Reservation Quota?</label>
                 <div className="flex gap-x-6 gap-y-2 mt-2 flex-wrap"> {/* Allow wrapping */}
                    {["Yes", "No"].map(option => (
                        <label key={option} className="flex items-center text-gray-300 cursor-pointer">
                            <input
                                type="radio"
                                name="reservation"
                                value={option}
                                checked={formData.reservation === option}
                                onChange={handleChange}
                                className="mr-2 focus:ring-teal-400 h-4 w-4 text-teal-500 border-gray-600" // Styled radio
                                disabled={isSubmitting || !!success}
                             />
                            {option}
                        </label>
                    ))}
                 </div>
             </div>

             {/* Reservation Type Select (Conditional) */}
             {formData.reservation === "Yes" && (
                 <div>
                    <label className="block text-indigo-200 text-sm font-medium mb-1">Reservation Type</label>
                    <select
                        name="reservationType"
                        value={formData.reservationType}
                        onChange={handleChange}
                        className="w-full px-4 py-2 mt-1 bg-gray-800/70 text-white rounded-lg outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-400 text-base border border-transparent shadow-sm appearance-none"
                        required={formData.reservation === "Yes"} // Only required if Yes is selected
                        disabled={isSubmitting || !!success}
                    >
                         <option value="">Select Reservation</option>
                         <option value="7.5%">7.5% Quota</option>
                         <option value="Sports">Sports Quota</option>
                         <option value="Ex-Serviceman">Ex-Serviceman</option>
                         <option value="Differently Abled">Differently Abled</option>
                    </select>
                 </div>
             )}

             {/* Password Input */}
             <div className="relative">
                <label className="block text-indigo-200 text-sm font-medium mb-1">Create Password</label>
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-1 bg-gray-800/70 text-white rounded-lg outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-400 text-base placeholder-gray-500 border border-transparent pr-10"
                    placeholder="Enter password for login"
                    required
                    disabled={isSubmitting || !!success}
                 />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-sm leading-5 text-gray-400 hover:text-teal-300 disabled:opacity-50"
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
                    className="w-full px-4 py-2 mt-1 bg-gray-800/70 text-white rounded-lg outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-400 text-base placeholder-gray-500 border border-transparent pr-10"
                    placeholder="Confirm password"
                    required
                    disabled={isSubmitting || !!success}
                 />
                <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-sm leading-5 text-gray-400 hover:text-teal-300 disabled:opacity-50"
                    disabled={isSubmitting || !!success}
                >
                    {showConfirmPassword ? "Hide" : "Show"}
                </button>
             </div>

          </div>

          {/* Submit Button (Spans both columns) */}
          <div className="md:col-span-2 mt-4"> {/* Increased top margin */}
             <button
                type="submit"
                className={`w-full bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white font-semibold py-3 text-lg rounded-lg transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg ${isSubmitting || success ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={isSubmitting || !!success}
              >
               {isSubmitting ? 'Registering...' : 'Submit Registration'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage; // Ensure export name matches filename if needed