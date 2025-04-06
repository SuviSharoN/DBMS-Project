import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const iphone = "/iphone.jpg"; // Image from the public folder

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/students/dashboard/${id}`);
        setStudent(res.data.data);
      } catch (error) {
        console.error("Error fetching student:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  if (loading) return <div className="p-6 text-center text-xl">Loading...</div>;
  if (!student) return <div className="p-6 text-center text-xl text-red-600">Student not found.</div>;

  const studentInfo = [
    { label: "Name", value: student.name },
    { label: "Reg No", value: student.id },
    { label: "Year", value: student.academic_details?.year || "-" },
    { label: "Email", value: student.email },
    { label: "Department", value: student.academic_details?.department || "-" },
  ];

  return (
    <div className="relative flex flex-col items-center py-12 min-h-screen bg-gray-100">
      {/* Sign Out Button (Top Right) */}
      <div className="absolute top-6 right-6">
        <button className="bg-red-500 text-white py-3 px-6 rounded-lg text-lg font-semibold shadow-md hover:scale-105 transition-all duration-300">
          Sign Out
        </button>
      </div>

      <h2 className="text-4xl font-bold text-gray-800 mb-10">Student Dashboard</h2>

      <div className="flex flex-col md:flex-row bg-white shadow-xl border border-gray-300 p-8 rounded-xl w-full max-w-5xl">
        {/* Left Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center p-6 border-r border-gray-300">
          <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-gray-400 shadow-lg">
            <img src={iphone} alt="Student Profile" className="w-full h-full object-cover" />
          </div>
          <div className="text-left w-full mt-6">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">Student Information</h3>
            {studentInfo.map((item, index) => (
              <p key={index} className="text-lg text-gray-600">
                <span className="font-medium text-gray-900">{item.label}:</span> {item.value}
              </p>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 flex flex-wrap justify-center items-center gap-6 p-6">
          {["Circular", "Contact", "Fee", "Attendance", "Time Table", "Course Enroll"].map((label, index) => (
            <button
              key={index}
              className="w-48 bg-gradient-to-r from-blue-400 to-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold shadow-md hover:scale-105 transition-all duration-300"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
