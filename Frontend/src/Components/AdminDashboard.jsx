// src/Components/AdminDashboard.jsx (or your path)
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { TailSpin } from "react-loader-spinner";

function AdminDashboard() {
  const { id } = useParams();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added error state
  const navigate = useNavigate();

  const profileImage = "/annaunivlogo.jpg"; // from public folder

  useEffect(() => {
    const fetchAdmin = async () => {
        setLoading(true);
        setError(null);
      try {
        // Ensure this endpoint returns { success: true, data: { newAdmin: {...} } }
        const res = await axios.get(`http://localhost:5000/api/admin/dashboard/${id}`);
        if (res.data?.success && res.data?.data?.newAdmin) {
            setAdmin(res.data.data.newAdmin);
        } else {
            throw new Error(res.data?.message || "Invalid data structure received for admin");
        }
      } catch (error) {
        console.error("Error fetching admin:", error);
        setError(error.response?.data?.message || error.message || "Failed to load admin data.");
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };
    if(id) {
        fetchAdmin();
    } else {
        setError("Admin ID not provided in URL.");
        setLoading(false);
    }
  }, [id]);

  // Loading state
  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
       <TailSpin color="#4FD1C5" height={60} width={60} />
    </div>
  );
 // Error state
 if (error) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
       <div className="bg-red-100 border border-red-500 text-red-700 p-6 rounded-lg text-center">
          <p className="font-semibold mb-2">Error Loading Dashboard</p>
          <p>{error}</p>
          <button onClick={() => navigate('/login')} className="mt-4 bg-purple-500 text-white px-4 py-1 rounded hover:bg-purple-600">Go to Login</button>
       </div>
    </div>
  );
  // Not found state
  if (!admin) return (
     <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
         <div className="text-center text-xl text-gray-600">Admin data not found.</div>
     </div>
    );


  const adminInfo = [
    { label: "Name", value: admin.name },
    { label: "Admin ID", value: admin.id }, // Changed label
    { label: "Email", value: admin.email },
  ];

  // Ensure paths are correct for admin routes
  const dashboardOptions = [
    { label: "Circulars", path: "/admin/circular" },
    { label: "Attendance", path: "/admin/attendance" },
    { label: "Fee Payments", path: "/admin/fee" },
    { label: "Timetable", path: "/admin/timetable" },
    // Corrected the path for Admin access
    { label: "Course Enrollment", path: "/admin/course-enroll" },
    { label: "Contact Info", path: "/admin/contact" },
    ];

  const handleSignOut = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    // Apply bright gradient background and padding
    <div className="p-4 md:p-6 lg:p-8 relative min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 text-gray-800">
      {/* Sign Out Button - Styled for bright theme */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={handleSignOut}
          className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-2 px-5 rounded-lg text-base font-semibold shadow-md hover:from-red-600 hover:to-orange-600 hover:scale-105 transition-all duration-300"
        >
          Sign Out
        </button>
      </div>

      {/* Welcome Title - Gradient Text */}
      <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-8 text-center md:text-left">
        Admin Dashboard
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Profile Card - Frosted Glass */}
        <div className="lg:col-span-1 bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-6 ring-1 ring-purple-200 flex flex-col items-center">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-purple-200 shadow-lg mb-5 flex-shrink-0 ring-2 ring-purple-300 ring-offset-4 ring-offset-white">
            <img src={profileImage} alt="Admin Profile" className="w-full h-full object-cover" />
          </div>

          <div className="text-center w-full">
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-1">{admin.name}</h3>
            <p className="text-sm text-purple-600 font-medium mb-3">Administrator</p>
            {/* Info List - Bright Theme */}
            <div className="text-left w-full space-y-2 text-sm md:text-base border-t border-gray-200 pt-4 mt-4">
              {adminInfo.map((info, index) => (
                <p key={index} className="text-gray-600">
                  <span className="font-semibold text-purple-700 w-24 inline-block">{info.label}:</span>{" "}
                  <span className="break-words text-gray-800">{info.value || 'N/A'}</span>
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Action Buttons - Frosted Glass */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-6 ring-1 ring-purple-200">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-3">Admin Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
            {dashboardOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => navigate(option.path)}
                className="p-4 md:p-5 rounded-lg text-center bg-gradient-to-r from-purple-50 via-white to-purple-50 text-purple-700 font-semibold shadow-md border border-purple-200 hover:shadow-lg hover:shadow-purple-200/50 hover:scale-[1.03] hover:border-purple-300 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-purple-400"
              >
                <span className="text-sm md:text-base">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;