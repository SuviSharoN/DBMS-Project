import { useState } from "react";

function Attendance() {
  const annaunivlogo = "/annaunivlogo.jpg";
  const name = "SaravanaKumar B";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutSidebarOpen, setLogoutSidebarOpen] = useState(false);
  const [selectedSem, setSelectedSem] = useState("Semester 3");

  const attendanceData = {
    "Semester 3": [
      {course: "Digital System and Design", attendance: "80%"},
      {course: "Naan Mudhalvan", attendance: "85%"},
      { course: "Probability ans Statics", attendance: "88%" },
      { course: "Data Structures", attendance: "90%" },
      { course: "Java Programming", attendance: "60%" },
    ],
    "Semester 2": [
      { course: "Tamil - 1", attendance: "90%"},
      { course: "English - 1", attendance: "95%" },
      { course: "Chemistry", attendance: "80%" },
      { course: "Discrete Mathematics", attendance: "88%" },
      { course: "OOPS in C++", attendance: "75%" },
    ],
    "Semester 1": [
      { course: "Tamil - 1", attendance: "90%"},
      { course: "English - 1", attendance: "95%" },
      { course: "Matrices and Calculus", attendance: "85%"},
      { course: "Physics - 1", attendance: "82%" },
      { course: "Programming in C", attendance: "87%" },
    ],
  };

  return (
    <>
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#07899d] to-[#22d3ee] shadow-lg rounded-md">
        <div className="flex items-center gap-4">
          <img src={annaunivlogo} alt="Anna Univ Logo" className="w-12 h-12 rounded-full" />
          <h1 className="text-white text-lg font-bold">Attendance</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white text-2xl">&#9776;</button>
        </div>
        <div className="relative">
          <div className="flex items-center gap-3">
            <img src={annaunivlogo} alt="Profile" className="w-10 h-10 rounded-full" />
            <div>
              <h4 className="text-white text-sm font-medium">{name}</h4>
              <button onClick={() => setLogoutSidebarOpen(!logoutSidebarOpen)} className="bg-white text-black px-3 py-1 text-sm rounded-md">&#9660;</button>
            </div>
          </div>
          {logoutSidebarOpen && (
            <div className="absolute right-0 mt-2 bg-white text-black rounded-md shadow-lg p-2">
              <button onClick={() => setLogoutSidebarOpen(false)} className="block w-full text-left px-4 py-2 hover:bg-gray-200">Log Out</button>
            </div>
          )}
        </div>
      </div>

      <div className={`fixed top-0 left-0 w-64 h-full bg-gradient-to-r from-teal-700 to-cyan-400 text-white p-5 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300`}>
        <button onClick={() => setSidebarOpen(false)} className="text-xl">&times;</button>
        <div className="mt-5 flex flex-col gap-3">
          {["Dashboard", "Circular", "Attendance", "Contact", "Time Table", "Course Enroll"].map((item) => (
            <button key={item} className="bg-white text-blue-800 p-2 rounded-md hover:bg-blue-200">{item}</button>
          ))}
        </div>
      </div>

      <div className="container mx-auto mt-8 p-4 max-w-4xl">
        <h3 className="text-lg font-bold text-center mb-4">Attendance Details</h3>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <label className="block text-lg font-medium mb-2">Select Semester:</label>
          <select
            value={selectedSem}
            onChange={(e) => setSelectedSem(e.target.value)}
            className="mb-4 px-4 py-2 border rounded-md"
          >
            {Object.keys(attendanceData).map((sem) => (
              <option key={sem} value={sem}>{sem}</option>
            ))}
          </select>

          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-cyan-400 text-white">
                <th className="p-2 border">Course</th>
                <th className="p-2 border">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData[selectedSem].map((record, index) => (
                <tr key={index} className="text-center border">
                  <td className="p-2 border">{record.course}</td>
                  <td className={`p-2 border font-bold ${parseInt(record.attendance) > 75 ?  "text-green-600" :" text-red-600" }`}>{record.attendance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Attendance;