import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function AdminDashboard() {
  const { id } = useParams();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const iphone = "/annaunivlogo.jpg"; // Image from the public folder
  const navigate = useNavigate();
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/admin/dashboard/${id}`);
        console.log(res);
        setAdmin(res.data.data.newAdmin);
      } catch (error) {
        console.error("Error fetching admin:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [id]);

  if (loading) return <div className="p-6 text-center text-xl">Loading...</div>;
  if (!admin) return <div className="p-6 text-center text-xl text-red-600">Admin not found.</div>;

  const adminInfo = [
    { label: "Name", value: admin.name },
    { label: "Id ", value: admin.id },
    { label: "Email", value: admin.email },
  ];

  const dashboardOptions = [
    { label: "Circular", path: "/dashboard/circular" },
    { label: "Contact", path: "/dashboard/contact" },
    { label: "Fee", path: "/dashboard/fee" },
    { label: "Attendance", path: "/dashboard/attendance" },
    { label: "Time Table", path: "/dashboard/timetable" },
    { label: "Course Enroll", path: "/dashboard/course-enroll" },
  ];  

  const handleSignOut = () => {
    
    const isConfirmed = window.confirm("Are you sure you want to sign out?");

  
    if (isConfirmed) {
      
      console.log("Signing out confirmed...");
      navigate('/login'); 
    } else {
     
      console.log("Sign out cancelled.");
    }
  }; 
  return (
    <div className="relative flex flex-col items-center py-12 min-h-screen bg-gray-100">
      {/* Sign Out Button (Top Right) */}
      <div className="absolute top-6 right-6">
        <button
          onClick={handleSignOut} // This now triggers the confirmation first
          className="bg-red-500 text-white py-3 px-6 rounded-lg text-lg font-semibold shadow-md hover:bg-red-600 hover:scale-105 transition-all duration-300"
        >
          Sign Out
        </button>
      </div>

      <h2 className="text-4xl font-bold text-gray-800 mb-10">Admin Dashboard</h2>

      <div className="flex flex-col md:flex-row bg-white shadow-xl border border-gray-300 p-8 rounded-xl w-full max-w-5xl">
        {/* Left Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center p-6 border-r border-gray-300">
          <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-gray-400 shadow-lg">
            <img src={iphone} alt="Student Profile" className="w-full h-full object-cover" />
          </div>
          <div className="text-left w-full mt-6">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">Admin Information</h3>
            {adminInfo.map((item, index) => (
              <p key={index} className="text-lg text-gray-600">
                <span className="font-medium text-gray-900">{item.label}:</span> {item.value}
              </p>
            ))}
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-wrap justify-center items-center content-start gap-6 p-6">
          {dashboardOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => navigate(option.path)} // Navigate to the defined path
              className="w-48 bg-gradient-to-r from-blue-400 to-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold shadow-md hover:scale-105 hover:from-blue-500 hover:to-blue-700 transition-all duration-300"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
