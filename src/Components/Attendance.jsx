// src/Components/Attendance.js
import React, { useState, useEffect, useMemo } from 'react'; // Import React hooks

// --- Refined Mock Data ---
// Percentages are now numbers, added IDs
const ATTENDANCE_DATA = {
  "Semester 3": [
    { id: 's3c1', course: "Digital System and Design", attendance: 80 },
    { id: 's3c2', course: "Naan Mudhalvan", attendance: 85 },
    { id: 's3c3', course: "Probability and Statistics", attendance: 88 }, // Corrected spelling
    { id: 's3c4', course: "Data Structures", attendance: 90 },
    { id: 's3c5', course: "Java Programming", attendance: 60 },
  ],
  "Semester 2": [
    { id: 's2c1', course: "Tamil - 1", attendance: 90 },
    { id: 's2c2', course: "English - 1", attendance: 95 },
    { id: 's2c3', course: "Chemistry", attendance: 80 },
    { id: 's2c4', course: "Discrete Mathematics", attendance: 88 },
    { id: 's2c5', course: "OOPS in C++", attendance: 75 },
  ],
  "Semester 1": [
    { id: 's1c1', course: "Tamil - 1", attendance: 90 },
    { id: 's1c2', course: "English - 1", attendance: 95 },
    { id: 's1c3', course: "Matrices and Calculus", attendance: 85 },
    { id: 's1c4', course: "Physics - 1", attendance: 82 },
    { id: 's1c5', course: "Programming in C", attendance: 87 },
  ],
};

const ATTENDANCE_THRESHOLD = 75; // Define the threshold percentage

// --- Component ---
function Attendance() {
  // State
  const [selectedSem, setSelectedSem] = useState("Semester 3");
  const [semesterData, setSemesterData] = useState({}); // Store all data
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Simulate Fetching Data ---
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      try {
        // In a real app, fetch data here
        setSemesterData(ATTENDANCE_DATA);
        setError(null);
      } catch (err) {
        console.error("Failed to load attendance data:", err);
        setError("Failed to load attendance data.");
        setSemesterData({});
      } finally {
        setIsLoading(false);
      }
    }, 400); // Simulate loading
    return () => clearTimeout(timer);
  }, []); // Run once on mount

  // --- Get Data for Selected Semester ---
  const currentSemesterAttendance = useMemo(() => {
    return semesterData[selectedSem] || [];
  }, [selectedSem, semesterData]);

  // --- Calculate Overall Semester Attendance ---
  const overallAttendance = useMemo(() => {
    if (currentSemesterAttendance.length === 0) {
      return null; // Or 0 if preferred
    }
    const totalPercentage = currentSemesterAttendance.reduce((sum, record) => sum + record.attendance, 0);
    const average = totalPercentage / currentSemesterAttendance.length;
    return Math.round(average * 10) / 10; // Round to one decimal place
  }, [currentSemesterAttendance]);

  // --- Helper to get color based on attendance ---
  const getAttendanceColor = (percentage) => {
    if (percentage >= ATTENDANCE_THRESHOLD) return 'bg-green-500';
    if (percentage >= ATTENDANCE_THRESHOLD - 10) return 'bg-yellow-500'; // Warning zone (e.g., 65-74)
    return 'bg-red-500'; // Below warning zone
  };
  const getTextColor = (percentage) => {
    if (percentage >= ATTENDANCE_THRESHOLD) return 'text-green-700';
    if (percentage >= ATTENDANCE_THRESHOLD - 10) return 'text-yellow-700';
    return 'text-red-700';
  };

  // --- Render Logic ---
  if (isLoading) return <div className="flex justify-center items-center h-40"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div></div>;
  if (error) return <div className="text-center p-10 text-red-600 bg-red-100 rounded-lg">{error}</div>;

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-5xl">
      <h3 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800 tracking-tight">
        Attendance Report
      </h3>

      {/* Controls and Summary */}
      <div className="bg-white p-5 rounded-xl shadow-lg mb-8 border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Semester Selector */}
        <div className="w-full md:w-auto">
          <label htmlFor="semester-select" className="block text-sm font-medium mb-1 text-gray-600">Select Semester:</label>
          <select
            id="semester-select"
            value={selectedSem}
            onChange={(e) => setSelectedSem(e.target.value)}
            className="w-full md:w-64 appearance-none px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-base bg-white"
          >
            {Object.keys(semesterData).map((sem) => (
              <option key={sem} value={sem}>{sem}</option>
            ))}
          </select>
        </div>

        {/* Overall Attendance Display */}
        <div className="text-center md:text-right w-full md:w-auto mt-4 md:mt-0">
          <span className="block text-sm font-medium text-gray-600">Overall Attendance:</span>
          {overallAttendance !== null ? (
            <span className={`text-3xl font-bold ${getTextColor(overallAttendance)}`}>
              {overallAttendance}%
            </span>
          ) : (
            <span className="text-xl font-semibold text-gray-500">-</span>
          )}
           <p className="text-xs text-gray-500 mt-1">(Required: {ATTENDANCE_THRESHOLD}%)</p>
        </div>
      </div>

      {/* Attendance List/Cards */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-200">
        <h4 className="text-xl font-semibold mb-5 text-gray-700 border-b pb-2">
          Course Details - {selectedSem}
        </h4>
        {currentSemesterAttendance.length > 0 ? (
          <div className="space-y-4">
            {currentSemesterAttendance.map((record) => (
              <div key={record.id} className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4 hover:shadow-md transition-shadow duration-200">
                {/* Course Name */}
                <div className="flex-grow w-full sm:w-auto text-center sm:text-left">
                  <p className="font-semibold text-gray-800 text-base">{record.course}</p>
                </div>
                {/* Attendance Percentage & Bar */}
                <div className="w-full sm:w-1/2 lg:w-1/3 flex items-center gap-3 flex-shrink-0">
                   <span className={`w-14 text-right font-bold text-lg ${getTextColor(record.attendance)}`}>
                       {record.attendance}%
                   </span>
                   <div className="flex-grow bg-gray-200 rounded-full h-3 overflow-hidden">
                       <div
                           className={`h-full rounded-full transition-all duration-500 ease-out ${getAttendanceColor(record.attendance)}`}
                           style={{ width: `${record.attendance}%` }}
                           title={`${record.attendance}% Attendance`}
                       ></div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            No attendance data available for this semester.
          </div>
        )}
      </div>
    </div>
  );
}

export default Attendance;