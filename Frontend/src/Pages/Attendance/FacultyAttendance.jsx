// src/Pages/Attendance/FacultyAttendance.jsx

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { TailSpin } from "react-loader-spinner"; // Import loader if needed

const STATUS_OPTIONS = ["Present", "Absent", "Late", "Excused"];
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'; // Consistent API base

// Helper function to get token directly
const getAuthToken = () => localStorage.getItem('authToken');

function FacultyAttendance() {
    const [facultyCourses, setFacultyCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [attendanceStatuses, setAttendanceStatuses] = useState({});
    const [isLoadingCourses, setIsLoadingCourses] = useState(false);
    const [isLoadingStudents, setIsLoadingStudents] = useState(false);
    const [isLoadingAttendance, setIsLoadingAttendance] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState(null);

    // --- Fetch faculty's courses (Keep Logic) ---
    const fetchCourses = useCallback(async () => {
        setIsLoadingCourses(true);
        setMessage(null);
        setFacultyCourses([]);
        const token = getAuthToken();
        if (!token) { setMessage("Please log in to view courses."); setIsLoadingCourses(false); return; }
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            // Assuming this endpoint correctly returns the faculty's courses
            const response = await axios.get(`${API_BASE_URL}/faculty/mycourses`, config);
            if (Array.isArray(response.data)) { setFacultyCourses(response.data); }
            else { setMessage("Could not load courses correctly."); setFacultyCourses([]); }
        } catch (error) {
             console.error("Error fetching courses:", error.response?.data || error.message);
             let errorMsg = "Failed to fetch courses.";
             if (error.response?.status === 401 || error.response?.status === 403) { errorMsg = "Unauthorized or Forbidden."; /* Consider redirect */ }
             setMessage(errorMsg);
             setFacultyCourses([]);
        } finally { setIsLoadingCourses(false); }
    }, []);

    useEffect(() => { fetchCourses(); }, [fetchCourses]);

    // --- Fetch students when course changes (Keep Logic) ---
    useEffect(() => {
        if (!selectedCourseId) { setEnrolledStudents([]); return; };
        const fetchStudents = async () => {
            setIsLoadingStudents(true); setMessage(null); setEnrolledStudents([]); setAttendanceStatuses({});
            const token = getAuthToken();
            if (!token) { setMessage("Authentication token missing."); setIsLoadingStudents(false); return; }
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const response = await axios.get(`${API_BASE_URL}/attendance/faculty/course/${selectedCourseId}/students`, config);
                if (Array.isArray(response.data)) { setEnrolledStudents(response.data); }
                else { setMessage("Could not load students correctly."); setEnrolledStudents([]); }
            } catch (error) {
                 console.error("Error fetching students:", error.response?.data || error.message);
                 let errorMsg = "Failed to fetch students.";
                 if (error.response?.status === 401 || error.response?.status === 403) { errorMsg = "Unauthorized or Forbidden fetching students."; }
                 setMessage(errorMsg);
                 setEnrolledStudents([]);
            } finally { setIsLoadingStudents(false); }
        };
        fetchStudents();
    }, [selectedCourseId]);

    // --- Fetch attendance when course or date changes (Keep Logic) ---
    useEffect(() => {
        if (!selectedCourseId || !selectedDate) { setAttendanceStatuses({}); return; }
        const fetchAttendance = async () => {
            setIsLoadingAttendance(true); setMessage(null); setAttendanceStatuses({});
            const token = getAuthToken();
            if (!token) { setMessage("Authentication token missing."); setIsLoadingAttendance(false); return; }
            try {
                 const config = { headers: { Authorization: `Bearer ${token}` } };
                 const response = await axios.get(`${API_BASE_URL}/attendance/faculty/course/${selectedCourseId}/date/${selectedDate}`, config);
                if (Array.isArray(response.data)) {
                   const attendanceMap = {};
                   response.data.forEach(entry => { if (entry.student_id != null) attendanceMap[entry.student_id] = entry.status; });
                   setAttendanceStatuses(attendanceMap);
                } else { setMessage("Could not load attendance records correctly."); setAttendanceStatuses({}); }
            } catch (error) {
                console.error("Error fetching attendance:", error.response?.data || error.message);
                 let errorMsg = "Failed to fetch attendance records.";
                 if (error.response?.status === 401 || error.response?.status === 403) { errorMsg = "Unauthorized or Forbidden fetching attendance."; }
                 setMessage(errorMsg);
                 setAttendanceStatuses({});
            } finally { setIsLoadingAttendance(false); }
        };
        fetchAttendance();
    }, [selectedCourseId, selectedDate]);

    // --- Handle status change locally (Keep Logic) ---
    const handleStatusChange = (studentId, status) => {
        setAttendanceStatuses(prev => ({ ...prev, [studentId]: status }));
    };

    // --- Save changes to backend (Keep Logic) ---
    const handleSaveChanges = async () => {
        setIsSaving(true); setMessage(null);
        const token = getAuthToken();
        if (!token) { setMessage("Authentication error. Cannot save."); setIsSaving(false); return; }
        try {
            const attendanceData = enrolledStudents.map(student => ({
                studentId: student.id,
                status: attendanceStatuses[student.id] || "Absent", // Default if unset
            }));
            const payload = { courseId: selectedCourseId, date: selectedDate, attendanceData: attendanceData };
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post(`${API_BASE_URL}/attendance/mark`, payload, config);
            setMessage("Attendance saved successfully.");
        } catch (error) {
             console.error("Error saving attendance:", error.response?.data || error.message);
             let errorMsg = "Failed to save attendance.";
             if (error.response?.status === 401 || error.response?.status === 403) errorMsg = "Unauthorized or Forbidden.";
             else if (error.response?.status === 400) errorMsg = `Error saving: ${error.response.data.message || 'Invalid data.'}`;
             setMessage(errorMsg);
        } finally { setIsSaving(false); }
    };

    // --- Handle Date Input Change (Keep Logic) ---
    const handleDateChange = (e) => { setSelectedDate(e.target.value); };

    // --- Render ---
    return (
        // Applied dark gradient background, consistent padding
        <div className="container mx-auto py-10 px-4 min-h-screen bg-gradient-to-br from-black via-indigo-950 to-teal-900 text-gray-200">
            {/* Gradient Title */}
            <h2 className="text-3xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-teal-400 tracking-tight">
                Faculty Attendance Panel
            </h2>

            {/* Display Message Area - Styled for dark theme */}
            {message && (
                <div className={`mb-6 text-center text-sm px-4 py-3 rounded-md border ${
                    message.toLowerCase().includes('success')
                    ? 'text-green-300 bg-green-900/50 border-green-500/50'
                    : 'text-red-300 bg-red-900/50 border-red-500/50'
                }`}>
                    {message}
                </div>
            )}

             {/* Controls Section - Frosted Glass Effect */}
             <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 p-6 bg-gray-900/60 backdrop-blur-md rounded-2xl shadow-lg ring-1 ring-purple-400/30">
                {/* Course Selection */}
                <div className="w-full md:w-auto flex-1 md:flex-none">
                    <label htmlFor="course-select" className="block text-sm font-medium mb-1 text-indigo-200">Select Course:</label>
                    {isLoadingCourses ? (
                        <div className="text-gray-500 italic h-10 flex items-center">Loading courses...</div> // Placeholder height
                    ) : Array.isArray(facultyCourses) && facultyCourses.length > 0 ? (
                         // Dark theme select styling
                        <select
                            id="course-select"
                            value={selectedCourseId}
                            onChange={(e) => setSelectedCourseId(e.target.value)}
                            className="w-full md:min-w-[250px] px-4 py-2 border-transparent rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-400 bg-gray-800/70 text-gray-100 text-base"
                        >
                            <option value="">-- Choose a Course --</option>
                            {facultyCourses.map(course => (
                                <option key={course.id} value={course.id}>
                                    {/* Ensure display value is correct */}
                                    {course.course?.course_name || course.course_name || course.name || `Course ID ${course.course?.id || course.id}`}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <div className="text-gray-500 italic h-10 flex items-center">No courses assigned.</div> // Placeholder height
                    )}
                </div>

                {/* Date Picker */}
                <div className="w-full md:w-auto">
                    <label htmlFor="date-select" className="block text-sm font-medium mb-1 text-indigo-200">Select Date:</label>
                     {/* Dark theme date input styling */}
                    <input
                        type="date"
                        id="date-select"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="w-full md:min-w-[200px] px-4 py-2 border-transparent rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-400 bg-gray-800/70 text-gray-100 text-base appearance-none" // Basic appearance reset
                        max={new Date().toISOString().split("T")[0]} // Keep max date
                    />
                </div>
            </div>

            {/* Loading Indicator for Students/Attendance */}
             {(isLoadingStudents || isLoadingAttendance) && (
                 <div className="flex justify-center items-center h-40">
                     <TailSpin color="#4FD1C5" height={40} width={40} />
                     <span className="ml-3 text-gray-400">Loading student data...</span>
                 </div>
             )}


            {/* Student List & Attendance Statuses - Only show if NOT loading and students exist */}
            {!isLoadingStudents && !isLoadingAttendance && selectedCourseId && enrolledStudents.length > 0 ? (
                // Frosted glass container for the table
                <div className="bg-gray-900/60 backdrop-blur-md shadow-xl rounded-2xl p-4 md:p-6 ring-1 ring-purple-400/30 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-fixed"> {/* Use table-fixed for better column control */}
                            <thead className="border-b border-gray-700">
                                <tr>
                                    {/* Adjusted padding and text alignment */}
                                    <th className="w-3/5 px-4 py-3 text-left text-xs font-medium text-indigo-200 uppercase tracking-wider">Student Name</th>
                                    <th className="w-2/5 px-4 py-3 text-left text-xs font-medium text-indigo-200 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/50">
                                {Array.isArray(enrolledStudents) && enrolledStudents.map(student => {
                                    if (!student || student.id == null) return null; // Skip invalid student data
                                    return (
                                        <tr key={student.id} className="hover:bg-gray-800/50 transition-colors duration-150">
                                            {/* Adjusted padding */}
                                            <td className="px-4 py-3 text-gray-100 whitespace-nowrap">{student.name || `Student ID ${student.id}`}</td>
                                            <td className="px-4 py-3">
                                                {/* Dark theme select */}
                                                <select
                                                    value={attendanceStatuses[student.id] || STATUS_OPTIONS[1]} // Default 'Absent'
                                                    onChange={(e) => handleStatusChange(student.id, e.target.value)}
                                                    className="px-3 py-1.5 border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 bg-gray-700/80 text-gray-100 text-sm appearance-none" // Adjusted appearance
                                                >
                                                    {STATUS_OPTIONS.map(status => (
                                                        <option key={status} value={status}>
                                                            {status}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                     {/* Save Button - Themed */}
                    <div className="mt-8 text-center">
                        <button
                            onClick={handleSaveChanges}
                            disabled={isSaving || isLoadingCourses || isLoadingStudents || isLoadingAttendance} // Disable if any loading/saving
                            className={`inline-block px-8 py-2.5 text-white text-base font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed ${
                                isSaving
                                    ? 'bg-gray-600' // Saving state background
                                    : 'bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 hover:scale-105' // Normal state gradient
                            }`}
                        >
                            {isSaving ? 'Saving...' : 'Save Attendance'}
                        </button>
                    </div>
                </div>
            ) : (
                // Message when no students or course not selected (and not loading)
                !isLoadingStudents && !isLoadingAttendance && selectedCourseId &&
                <div className="text-center text-gray-500 mt-10 p-6 bg-gray-800/50 rounded-lg">Select a course and date to view students, or no students are enrolled.</div>
            )}
             {/* Placeholder message if no course is selected */}
             {!selectedCourseId && !isLoadingCourses && (
                 <div className="text-center text-gray-500 mt-10 p-6 bg-gray-800/50 rounded-lg">Please select a course from the dropdown above.</div>
             )}
        </div>
    );
}

export default FacultyAttendance;