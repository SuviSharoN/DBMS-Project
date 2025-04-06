import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    id: "",
    email: "",
    dob: "",
    gender: "",
    category: "",
    phone: "",
    address: "",
    guardian_phone: "",
    guardian_name: "",
    department: "",
    year: "",
    joiningDate: "",
    reservation: "",
    reservationType: "",
    password: "", // Add password to formData
  });

  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const modifiedFormData = {
        ...formData,
        id: parseInt(formData.id),
        reservation: formData.reservation === "Yes",
      };
      const res = await axios.post("http://localhost:5000/api/students", modifiedFormData);
      
      console.log("Student added:", res.data);
      alert("Registration successful!");
      const stud_id = modifiedFormData.id;
      navigate(`/dashboard/${stud_id}`); // Navigate to the dashboard after success
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-cyan-400">
      <div className="absolute top-6 right-6">
        <button onClick={() => navigate('/login')} className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition">
          Login
        </button>
      </div>

    
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Student Registration</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-300 outline-none"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Registration Number */}
          <div>
            <label className="block text-gray-700 font-medium">Registration Number</label>
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-300 outline-none"
              placeholder="Enter your Reg No"
              required
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-gray-700 font-medium">Mobile Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              pattern="[0-9]{10}"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-300 outline-none"
              placeholder="Enter your 10-digit mobile number"
              required
            />
          </div>

          {/* Guardian Name */}
          <div>
            <label className="block text-gray-700 font-medium">Guardian/Parent Name</label>
            <input
              type="text"
              name="guardian_name"
              value={formData.guardian_name}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-300 outline-none"
              placeholder="Enter guardian/parent name"
              required
            />
          </div>

          {/* Guardian Phone */}
          <div>
            <label className="block text-gray-700 font-medium">Guardian's Phone Number</label>
            <input
              type="tel"
              name="guardian_phone"
              value={formData.guardian_phone}
              onChange={handleChange}
              pattern="[0-9]{10}"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-300 outline-none"
              placeholder="Enter guardian's phone number"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-700 font-medium">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-300 outline-none"
              placeholder="Enter your address"
              required
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
              placeholder="Enter your email"
              required
            />
          </div>

          {/* DOB */}
          <div>
            <label className="block text-gray-700 font-medium">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-300 outline-none"
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-700 font-medium">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-300 outline-none"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 font-medium">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-300 outline-none"
            >
              <option value="">Select</option>
              <option value="BC">BC</option>
              <option value="MBC">MBC</option>
              <option value="OC">OC</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
            </select>
          </div>

          {/* Reservation */}
          <div>
            <label className="block text-gray-700 font-medium">Do you have a Reservation?</label>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="reservation"
                  value="Yes"
                  checked={formData.reservation === "Yes"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="reservation"
                  value="No"
                  checked={formData.reservation === "No"}
                  onChange={handleChange}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>

          {/* Reservation Type */}
          {formData.reservation === "Yes" && (
            <div>
              <label className="block text-gray-700 font-medium">Select Reservation Type</label>
              <select
                name="reservationType"
                value={formData.reservationType}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-300 outline-none"
              >
                <option value="">Select</option>
                <option value="7.5%">7.5% Quota</option>
                <option value="Sports">Sports Quota</option>
                <option value="Ex-Serviceman">Ex-Serviceman</option>
                <option value="Differently Abled">Differently Abled</option>
              </select>
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-300 outline-none"
              placeholder="Enter your password for login"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
