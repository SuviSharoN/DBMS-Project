// src/Pages/Attendance/FacultyAttendance.jsx

import React, { useEffect, useState, useCallback } from "react"; // Added useCallback
import axios from "axios";

const STATUS_OPTIONS = ["Present", "Absent", "Late", "Excused"];

// --- Helper function to get token directly ---
const getAuthToken = () => localStorage.getItem('authToken');

function FacultyAttendance() { // Removed facultyId prop assumption
    const [facultyCourses, setFacultyCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [attendanceStatuses, setAttendanceStatuses] = useState({});
    const [isLoadingCourses, setIsLoadingCourses] = useState(false); // Specific loading state
    const [isLoadingStudents, setIsLoadingStudents] = useState(false);
    const [isLoadingAttendance, setIsLoadingAttendance] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState(null);

    // --- Fetch faculty's courses ---
    const fetchCourses = useCallback(async () => {
        setIsLoadingCourses(true); // Start loading courses
        setMessage(null);
        setFacultyCourses([]); // Clear previous

        const token = getAuthToken(); // Get token from localStorage

        if (!token) {
            console.log("Fetch courses skipped: No auth token found in localStorage.");
            setMessage("Please log in to view courses.");
            setIsLoadingCourses(false); // Stop loading
            return; // Don't proceed without token
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}` // Add token to header
                }
            };

            const response = await axios.get(`/api/faculty/mycourses`, config);
            console.log("Courses API Response:", response.data);

            if (Array.isArray(response.data)) {
                setFacultyCourses(response.data);
            } else {
                console.warn("Received non-array data for courses:", response.data);
                setMessage("Could not load courses correctly.");
                setFacultyCourses([]); // Ensure empty array
            }

        } catch (error) {
            console.error("Error fetching courses:", error.response?.data || error.message);
             if (error.response?.status === 401) {
                 setMessage("Unauthorized: Session may have expired. Please log out and log in again.");
                 // Consider clearing localStorage here if token is definitively bad
                 // localStorage.removeItem('authToken');
                 // localStorage.removeItem('userRole');
                 // localStorage.removeItem('userId');
                 // window.location.href = '/login'; // Force redirect
             } else if (error.response?.status === 403) {
                  setMessage("Forbidden: You do not have permission.");
             }
             else {
                 setMessage("Failed to fetch courses.");
             }
            setFacultyCourses([]); // Reset on error
        } finally {
            setIsLoadingCourses(false); // Stop loading courses
        }
    }, []); // No external dependencies needed for this specific fetch logic

    // Run fetchCourses on component mount
    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]); // Depend on the memoized callback

    // --- Fetch students when course changes ---
    useEffect(() => {
        if (!selectedCourseId) {
            setEnrolledStudents([]); // Clear students if no course selected
            return;
        };

        const fetchStudents = async () => {
            setIsLoadingStudents(true);
            setMessage(null); // Clear previous messages
            setEnrolledStudents([]); // Clear previous students
            setAttendanceStatuses({}); // Clear previous statuses

            const token = getAuthToken(); // Need token for this too
            if (!token) {
                setMessage("Authentication token missing. Please log in.");
                setIsLoadingStudents(false);
                return;
            }

            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                // *** Verify this endpoint matches your backend ***
                // It was '/api/attendance/faculty/course/:courseId/students' before
                // Let's assume it might just be '/api/course/:courseId/students' now
                const response = await axios.get(`/api/attendance/faculty/course/${selectedCourseId}/students`, config);

                if (Array.isArray(response.data)) {
                   setEnrolledStudents(response.data);
                } else {
                   console.warn("Received non-array data for students:", response.data);
                   setMessage("Could not load students correctly.");
                   setEnrolledStudents([]);
                }

            } catch (error) {
                console.error("Error fetching students:", error.response?.data || error.message);
                 if (error.response?.status === 401) {
                    setMessage("Unauthorized fetching students. Please log in again.");
                 } else if (error.response?.status === 403) {
                     setMessage("Forbidden: Cannot access students for this course.");
                 }
                 else {
                    setMessage("Failed to fetch students.");
                 }
                setEnrolledStudents([]);
            } finally {
                setIsLoadingStudents(false);
            }
        };
        fetchStudents();
    }, [selectedCourseId]); // Re-run when selectedCourseId changes

    // --- Fetch attendance when course or date changes ---
    useEffect(() => {
        if (!selectedCourseId || !selectedDate) {
             setAttendanceStatuses({}); // Clear statuses if no course/date
             return;
        }

        const fetchAttendance = async () => {
            setIsLoadingAttendance(true);
            setMessage(null);
            setAttendanceStatuses({}); // Clear previous

            const token = getAuthToken();
            if (!token) {
                 setMessage("Authentication token missing. Please log in.");
                 setIsLoadingAttendance(false);
                 return;
            }

            try {
                 const config = { headers: { Authorization: `Bearer ${token}` } };
                 // *** Verify this endpoint matches your backend ***
                 // It was '/api/attendance/faculty/course/:courseId/date/:date' before
                 // Let's adjust based on the previous GET example
                 const response = await axios.get(`/api/attendance/faculty/course/${selectedCourseId}/date/${selectedDate}`, config);
                if (Array.isArray(response.data)) {
                   const attendanceMap = {};
                   // Assuming response.data is like [{ student_id: X, status: 'Present' }, ...]
                   response.data.forEach(entry => {
                       // Make sure student_id exists in your backend response
                       if (entry.student_id != null) {
                           attendanceMap[entry.student_id] = entry.status;
                       } else {
                           console.warn("Attendance record missing student_id:", entry);
                       }
                   });
                   setAttendanceStatuses(attendanceMap);
                } else {
                   console.warn("Received non-array data for attendance:", response.data);
                   setMessage("Could not load attendance records correctly.");
                   setAttendanceStatuses({});
                }

            } catch (error) {
                console.error("Error fetching attendance:", error.response?.data || error.message);
                if (error.response?.status === 401) {
                   setMessage("Unauthorized fetching attendance. Please log in again.");
                } else if (error.response?.status === 403) {
                   setMessage("Forbidden: Cannot access attendance for this course/date.");
                } else {
                   setMessage("Failed to fetch attendance records.");
                }
                setAttendanceStatuses({});
            } finally {
                setIsLoadingAttendance(false);
            }
        };
        fetchAttendance();
    }, [selectedCourseId, selectedDate]); // Re-run when course or date changes

    // --- Handle status change locally ---
    const handleStatusChange = (studentId, status) => {
        setAttendanceStatuses(prev => ({
            ...prev,
            [studentId]: status,
        }));
    };

    // --- Save changes to backend ---
    const handleSaveChanges = async () => {
        setIsSaving(true);
        setMessage(null); // Clear previous message

        const token = getAuthToken();
        if (!token) {
            setMessage("Authentication error. Cannot save.");
            setIsSaving(false);
            return;
        }

        try {
            // Ensure enrolledStudents contains 'id' for each student
            const attendanceData = enrolledStudents.map(student => ({
                studentId: student.id, // Make sure student object has 'id'
                // courseId is needed by backend controller
                status: attendanceStatuses[student.id] || "Absent", // Default to Absent if not set
            }));

            // Prepare payload for the backend
            const payload = {
                 courseId: selectedCourseId, // Backend needs this
                 date: selectedDate,         // Backend needs this
                 attendanceData: attendanceData
            }

            const config = { headers: { Authorization: `Bearer ${token}` } };
            // *** Verify this endpoint matches your backend ***
            // It was '/api/attendance/faculty/mark' before
            await axios.post("/api/attendance/mark", payload, config);

            setMessage("Attendance saved successfully.");
            // Optionally refetch attendance to confirm, but success message might suffice
            // fetchAttendance();

        } catch (error) {
            console.error("Error saving attendance:", error.response?.data || error.message);
             if (error.response?.status === 401) {
                setMessage("Unauthorized: Session expired. Please log in again.");
             } else if (error.response?.status === 403) {
                 setMessage("Forbidden: You do not have permission to save attendance for this course.");
             } else if (error.response?.status === 400) {
                 setMessage(`Error saving: ${error.response.data.message || 'Invalid data.'}`);
             }
             else {
                 setMessage("Failed to save attendance due to a server error.");
             }
        } finally {
            setIsSaving(false);
        }
    };

    // --- Handle Date Input Change ---
    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    // --- Render ---
    return (
        <div className="max-w-5xl mx-auto py-10 px-4 bg-gray-900 text-gray-200">
            <h2 className="text-3xl font-bold text-center mb-8 text-cyan-400">Faculty Attendance Panel</h2>

            {/* Display Message Area */}
            {message && (
                <div className={`mb-4 text-center text-sm px-4 py-2 rounded-md ${message.toLowerCase().includes('success') ? 'text-green-400 bg-green-800' : 'text-red-400 bg-red-800'}`}>
                    {message}
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
                {/* Course Selection */}
                <div className="w-full md:w-auto">
                    <label htmlFor="course-select" className="block text-sm font-medium mb-1 text-gray-400">Select Course:</label>
                    {isLoadingCourses ? (
                        <div className="text-gray-500">Loading courses...</div>
                    ) : Array.isArray(facultyCourses) && facultyCourses.length > 0 ? (
                        <select
                            id="course-select"
                            value={selectedCourseId}
                            onChange={(e) => setSelectedCourseId(e.target.value)}
                            className="w-full md:w-64 px-4 py-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-gray-800 text-gray-200"
                        >
                            <option value="">-- Choose a Course --</option>
                            {facultyCourses.map(course => (
                                <option key={course.id} value={course.id}>
                                    {course.course_name || course.name || `Course ID ${course.id}`}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <div className="text-gray-500">No courses assigned or failed to load.</div>
                    )}
                </div>

                {/* Date Picker */}
                <div className="w-full md:w-auto">
                    <label htmlFor="date-select" className="block text-sm font-medium mb-1 text-gray-400">Select Date:</label>
                    <input
                        type="date"
                        id="date-select"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="w-full md:w-64 px-4 py-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-gray-800 text-gray-200"
                        max={new Date().toISOString().split("T")[0]}
                    />
                </div>
            </div>

            {/* Student List & Attendance Statuses */}
            {isLoadingStudents || isLoadingAttendance ? (
                <div className="text-center text-gray-500 mt-6">Loading data...</div>
            ) : selectedCourseId && enrolledStudents.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto bg-gray-800 shadow-md rounded-xl overflow-hidden">
                        <thead className="bg-gray-700 border-b border-gray-600">
                            <tr>
                                <th className="text-left px-6 py-4 font-medium text-gray-300">Student Name</th>
                                <th className="text-left px-6 py-4 font-medium text-gray-300">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(enrolledStudents) && enrolledStudents.map(student => {
                                if (!student || student.id == null) {
                                    console.warn("Invalid student data found:", student);
                                    return null;
                                }
                                return (
                                    <tr key={student.id} className="border-b border-gray-700 hover:bg-gray-700">
                                        <td className="px-6 py-3 text-gray-200">{student.name || `Student ID ${student.id}`}</td>
                                        <td className="px-6 py-3">
                                            <select
                                                value={attendanceStatuses[student.id] || STATUS_OPTIONS[1]}
                                                onChange={(e) => handleStatusChange(student.id, e.target.value)}
                                                className="px-3 py-1.5 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-gray-700 text-gray-200"
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
                    {/* Save Button */}
                    <div className="mt-8 text-center">
                        <button
                            onClick={handleSaveChanges}
                            disabled={isSaving}
                            className={`inline-block px-6 py-2.5 text-white font-semibold rounded-md transition-all ${
                                isSaving
                                    ? 'bg-gray-600 cursor-not-allowed'
                                    : 'bg-cyan-600 hover:bg-cyan-700'
                            }`}
                        >
                            {isSaving ? 'Saving...' : 'Save Attendance'}
                        </button>
                    </div>
                </div>
            ) : (
                selectedCourseId && <div className="text-center text-gray-500 mt-6">No students enrolled in this course, or failed to load students.</div>
            )}
        </div>
    );
}

export default FacultyAttendance;