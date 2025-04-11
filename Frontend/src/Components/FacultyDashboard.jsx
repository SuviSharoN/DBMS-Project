import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function FacultyDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);

  const profileImage = "/annaunivlogo.jpg"; // Image from public folder

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/faculty/dashboard/${id}`);
        setFaculty(res.data.data.newFaculty);
      } catch (error) {
        console.error("Error fetching faculty:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, [id]);

  if (loading) return <div className="p-6 text-center text-xl">Loading...</div>;
  if (!faculty) return <div className="p-6 text-center text-xl text-red-600">Faculty not found.</div>;

  const facultyInfo = [
    { label: "Name", value: faculty.name },
    { label: "Faculty ID", value: faculty.id },
    { label: "Email", value: faculty.email },
    { label: "Department", value: faculty.department },
  ];

  const dashboardOptions = [
    { label: "Circulars", path: "/dashboard/circular" },
    { label: "Attendance", path: "/dashboard/attendance" },
    { label: "Fee Payments", path: "/dashboard/fee" },
    { label: "Timetable", path: "/dashboard/timetable" },
    // { label: "Course Enrollment", path: "/dashboard/course-enroll" },
    { label: "Contact Info", path: "/dashboard/contact" },
  ];

  const handleSignOut = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      navigate("/login");
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 relative min-h-screen bg-gray-50">
      {/* Sign Out Button */}
      <div className="absolute top-6 right-6">
        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white py-3 px-6 rounded-lg text-lg font-semibold shadow-md hover:bg-red-600 hover:scale-105 transition-all duration-300"
        >
          Sign Out
        </button>
      </div>

      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center md:text-left">
        Welcome, {faculty.name}!
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-xl p-6 border border-gray-200 flex flex-col items-center">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-cyan-200 shadow-lg mb-5 flex-shrink-0 ring-2 ring-cyan-400 ring-offset-2">
            <img src={profileImage} alt="Faculty Profile" className="w-full h-full object-cover" />
          </div>

          <div className="text-center w-full">
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-1">{faculty.name}</h3>
            <p className="text-sm text-cyan-700 font-medium mb-3">{faculty.department}</p>
            <div className="text-left w-full space-y-2 text-sm md:text-base border-t pt-4 mt-4">
              {facultyInfo.map((info, index) => (
                <p key={index} className="text-gray-600">
                  <span className="font-semibold text-gray-700 w-28 inline-block">{info.label}:</span>{" "}
                  <span className="break-words">{info.value}</span>
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="lg:col-span-2 bg-white shadow-xl rounded-xl p-6 border border-gray-200">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-700 mb-6 border-b pb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
            {dashboardOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => navigate(option.path)}
                className="p-4 md:p-5 rounded-lg text-center bg-gradient-to-r from-cyan-50 to-blue-100 text-blue-800 font-semibold shadow-md border border-blue-200 hover:shadow-lg hover:scale-[1.03] hover:from-cyan-100 hover:to-blue-200 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400"
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

export default FacultyDashboard;
