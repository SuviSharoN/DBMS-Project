// src/Components/Attendance.js
import { useState } from "react";
// Removed useNavigate as it's handled by Layout.js
// Removed annaunivlogo and name as they are in Layout.js

function Attendance() {
  // Keep state specific to the Attendance page
  const [selectedSem, setSelectedSem] = useState("Semester 3"); // Default semester

  // Keep data specific to the Attendance page
  const attendanceData = {
    "Semester 3": [
      { course: "Digital System and Design", attendance: "80%" },
      { course: "Naan Mudhalvan", attendance: "85%" },
      { course: "Probability ans Statics", attendance: "88%" },
      { course: "Data Structures", attendance: "90%" },
      { course: "Java Programming", attendance: "60%" },
    ],
    "Semester 2": [
      { course: "Tamil - 1", attendance: "90%" },
      { course: "English - 1", attendance: "95%" },
      { course: "Chemistry", attendance: "80%" },
      { course: "Discrete Mathematics", attendance: "88%" },
      { course: "OOPS in C++", attendance: "75%" },
    ],
    "Semester 1": [
      { course: "Tamil - 1", attendance: "90%" },
      { course: "English - 1", attendance: "95%" },
      { course: "Matrices and Calculus", attendance: "85%" },
      { course: "Physics - 1", attendance: "82%" },
      { course: "Programming in C", attendance: "87%" },
    ],
    // Add more semesters as needed
  };

  // Removed handleLogout function - it's in Layout.js

  // --- JSX for Attendance Content ONLY ---
  // No <>, Header, or Sidebar here. That's handled by Layout.js
  return (
    <div className="container mx-auto p-4 max-w-4xl"> {/* Adjust padding/margin if Layout handles it */}
      <h3 className="text-2xl font-bold text-center mb-6 text-gray-700">Attendance Details</h3>
      <div className="bg-white p-6 rounded-lg shadow-md"> {/* Increased padding */}
        <div className="mb-6"> {/* Added margin below select */}
          <label htmlFor="semester-select" className="block text-lg font-medium mb-2 text-gray-700">Select Semester:</label>
          <select
            id="semester-select" // Added id for label association
            value={selectedSem}
            onChange={(e) => setSelectedSem(e.target.value)}
            className="w-full md:w-1/2 lg:w-1/3 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" // Added styling and responsiveness
          >
            {Object.keys(attendanceData).map((sem) => (
              <option key={sem} value={sem}>{sem}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto"> {/* Ensure table is scrollable on small screens */}
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-cyan-500 text-white"> {/* Consistent header color */}
                <th className="p-3 border text-left">Course</th> {/* Left align header */}
                <th className="p-3 border text-center">Attendance</th> {/* Center align header */}
              </tr>
            </thead>
            <tbody>
              {attendanceData[selectedSem] && attendanceData[selectedSem].length > 0 ? (
                 attendanceData[selectedSem].map((record, index) => (
                  <tr key={index} className="border hover:bg-gray-100 transition-colors duration-150">
                    <td className="p-3 border text-left">{record.course}</td>
                    <td className={`p-3 border font-semibold text-center ${parseInt(record.attendance) >= 75 ? "text-green-600" : "text-red-600"}`}> {/* Corrected condition, added font-semibold */}
                      {record.attendance}
                    </td>
                  </tr>
                 ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center p-4 text-gray-500">No attendance data available for this semester.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    // No closing </> needed
  );
}

export default Attendance;