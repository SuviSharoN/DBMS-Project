// Student Dashboard Component: Displays student profile and quick access to academic features
// Features: Profile display, attendance tracking, fee management, and course enrollment

// src/Components/Dashboard.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { TailSpin } from "react-loader-spinner"; // Assuming you might want a loader

function Dashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [academics, setAcademics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added error state

  const profileImage = "/annaunivlogo.jpg"; // Image from public folder

  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true); // Start loading
      setError(null);   // Clear previous errors
      try {
        console.log("Fetching student data for dashboard:", id);
        const res = await axios.get(`http://localhost:5000/api/students/dashboard/${id}`);
        // Assuming response structure is { success: true, data: { student: {...}, academic: [{...}] } }
        if (res.data?.success && res.data?.data) {
            setStudent(res.data.data.student);
            setAcademics(res.data.data.academic);
        } else {
            throw new Error(res.data?.message || "Invalid data structure received");
        }
      } catch (error) {
        console.error("Error fetching student:", error);
        setError(error.response?.data?.message || error.message || "Failed to load student data.");
        setStudent(null); // Clear data on error
        setAcademics(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) { // Only fetch if ID is present
        fetchStudent();
    } else {
        setError("Student ID not provided in URL.");
        setLoading(false);
    }
  }, [id]);

  // Loading state
  if (loading) return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
         <TailSpin color="#4FD1C5" height={60} width={60} />
      </div>
    );
  // Error state after loading
  if (error) return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
           <div className="bg-red-100 border border-red-500 text-red-700 p-6 rounded-lg text-center">
              <p className="font-semibold mb-2">Error Loading Dashboard</p>
              <p>{error}</p>
              <button onClick={() => navigate('/login')} className="mt-4 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">Go to Login</button>
           </div>
        </div>
    );
   // If loading finished and student is still null (should be caught by error state usually)
   if (!student || !academics || academics.length === 0) return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
            <div className="text-center text-xl text-gray-600">Student or Academic data not found.</div>
        </div>
    );


  // Assuming academics is an array, get the first record
  const academicInfo = academics[0];

  const studentInfo = [
    { label: "Name", value: student.name },
    { label: "Reg No", value: student.id },
    { label: "Year", value: academicInfo?.year ? `${academicInfo.year}${['st', 'nd', 'rd'][academicInfo.year-1] || 'th'} Year` : 'N/A' }, // Add suffix
    { label: "Email", value: student.email },
    { label: "Department", value: academicInfo?.department || 'N/A' },
  ];

  const dashboardOptions = [
    { label: "Circulars", path: `/dashboard/circular` }, // Use dynamic ID in paths
    { label: "Attendance", path: `/dashboard/attendance` },
    { label: "Fee Payments", path: `/dashboard/fee` },
    { label: "Timetable", path: `/dashboard/timetable` },
    { label: "Course Enrollment", path: `/dashboard/course-enroll` },
    { label: "Contact Info", path: `/dashboard/contact` },
  ];

  const handleSignOut = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      localStorage.clear(); // Clear auth token etc.
      navigate("/login");
    }
  };

  return (
    // Apply bright gradient background and padding
    <div className="p-4 md:p-6 lg:p-8 relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-800">
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
      <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600 mb-8 text-center md:text-left">
        Welcome, {student.name}!
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Profile Card - Frosted Glass */}
        <div className="lg:col-span-1 bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-6 ring-1 ring-blue-200 flex flex-col items-center">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-blue-200 shadow-lg mb-5 flex-shrink-0 ring-2 ring-blue-300 ring-offset-4 ring-offset-white">
            <img src={profileImage} alt="Student Profile" className="w-full h-full object-cover" />
          </div>

          <div className="text-center w-full">
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-1">{student.name}</h3>
            <p className="text-sm text-blue-600 font-medium mb-3">{academicInfo?.department || 'Department N/A'}</p>
            {/* Info List - Bright Theme */}
            <div className="text-left w-full space-y-2 text-sm md:text-base border-t border-gray-200 pt-4 mt-4">
              {studentInfo.map((info, index) => (
                <p key={index} className="text-gray-600">
                  <span className="font-semibold text-blue-700 w-24 inline-block">{info.label}:</span>{" "}
                  <span className="break-words text-gray-800">{info.value || 'N/A'}</span>
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Action Buttons - Frosted Glass */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-6 ring-1 ring-blue-200">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
            {dashboardOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => navigate(option.path)}
                className="p-4 md:p-5 rounded-lg text-center bg-gradient-to-r from-blue-50 via-white to-blue-50 text-blue-700 font-semibold shadow-md border border-blue-200 hover:shadow-lg hover:shadow-blue-200/50 hover:scale-[1.03] hover:border-blue-300 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-400"
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

export default Dashboard;