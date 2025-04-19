// src/Components/StudentAttendance.js
import React, { useState, useEffect, useMemo } from 'react';

const ATTENDANCE_THRESHOLD = 75; // Define the threshold percentage

function StudentAttendance() {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Fetch Data from Backend ---
    useEffect(() => {
        const fetchAttendance = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // *** GET AUTH TOKEN (Replace with your actual logic) ***
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error('Authentication token not found. Please log in.');
                }

                // Call the backend endpoint for student summary
                const response = await fetch('/api/attendance/student/summary', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Send the token
                    },
                });

                if (!response.ok) {
                    let errorMsg = `Error: ${response.status}`;
                    try {
                         const errorData = await response.json();
                         errorMsg = errorData.message || errorMsg;
                    } catch(e) { /* Ignore if body isn't JSON */ console.warn(e)}
                    throw new Error(errorMsg.message);
                }

                const data = await response.json();
                console.log("hey"+data);
                setAttendanceRecords(data); // Store the fetched data array

            } catch (err) {
                console.error("Failed to fetch attendance data:", err);
                setError(err.message || "Failed to load attendance data.");
                setAttendanceRecords([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAttendance();
    }, []); // Run once on mount

    // --- Calculate Overall Attendance ---
    const overallAttendance = useMemo(() => {
        if (attendanceRecords.length === 0) return null;
        // Calculate average based on individual course percentages fetched
        const totalPercentage = attendanceRecords.reduce((sum, record) => sum + record.percentage, 0);
        const average = totalPercentage / attendanceRecords.length;
        return Math.round(average * 10) / 10;
    }, [attendanceRecords]);

    // --- Styling Helpers ---
     const getAttendanceColor = (percentage) => {
        if (percentage >= ATTENDANCE_THRESHOLD) return 'bg-green-500';
        if (percentage >= ATTENDANCE_THRESHOLD - 10) return 'bg-yellow-500';
        return 'bg-red-500';
     };
     const getTextColor = (percentage) => {
        if (percentage >= ATTENDANCE_THRESHOLD) return 'text-green-700';
        if (percentage >= ATTENDANCE_THRESHOLD - 10) return 'text-yellow-700';
        return 'text-red-700';
     };

    // --- Render Logic ---
    if (isLoading) return <div className="flex justify-center items-center h-40"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div></div>;

    return (
        <div className="container mx-auto p-4 md:p-6 max-w-5xl">
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800 tracking-tight">
                My Attendance Report
            </h3>

            {error && <div className="mb-4 p-4 text-center text-red-700 bg-red-100 rounded-lg">{error}</div>}

            {/* Overall Summary */}
            <div className="bg-white p-5 rounded-xl shadow-lg mb-8 border border-gray-200 flex justify-end items-center gap-4">
                <div className="text-center md:text-right w-full md:w-auto">
                    <span className="block text-sm font-medium text-gray-600">Overall Average:</span>
                    {overallAttendance !== null ? (
                        <span className={`text-3xl font-bold ${getTextColor(overallAttendance)}`}>
                            {overallAttendance}%
                        </span>
                    ) : (
                         !error && <span className="text-xl font-semibold text-gray-500">-</span>
                    )}
                    <p className="text-xs text-gray-500 mt-1">(Required: {ATTENDANCE_THRESHOLD}%)</p>
                </div>
            </div>

            {/* Attendance List */}
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-200">
                <h4 className="text-xl font-semibold mb-5 text-gray-700 border-b pb-2">
                    Course Details
                </h4>
                {attendanceRecords.length > 0 ? (
                    <div className="space-y-4">
                        {attendanceRecords.map((record) => (
                            <div key={record.facultyCourseId} className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4 hover:shadow-md transition-shadow duration-200">
                                {/* Course Name */}
                                <div className="flex-grow w-full sm:w-auto text-center sm:text-left">
                                    <p className="font-semibold text-gray-800 text-base">{record.courseName} ({record.courseId})</p>
                                    <p className="text-xs text-gray-500">Present: {record.presentClasses} / Total: {record.totalClasses}</p>
                                </div>
                                {/* Attendance Percentage & Bar */}
                                <div className="w-full sm:w-1/2 lg:w-1/3 flex items-center gap-3 flex-shrink-0">
                                    <span className={`w-14 text-right font-bold text-lg ${getTextColor(record.percentage)}`}>
                                        {record.percentage}%
                                    </span>
                                    <div className="flex-grow bg-gray-200 rounded-full h-3 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ease-out ${getAttendanceColor(record.percentage)}`}
                                            style={{ width: `${record.percentage}%` }}
                                            title={`${record.percentage}% Attendance`}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    !error && <div className="text-center py-10 text-gray-500">No attendance data available.</div>
                )}
            </div>
        </div>
    );
}

export default StudentAttendance;