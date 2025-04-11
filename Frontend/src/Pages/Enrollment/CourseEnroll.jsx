// Frontend/src/Pages/Enrollment/CourseEnroll.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; // For potential redirects
import axios from 'axios'; // Import axios directly

// --- Constants ---
const CREDIT_LIMIT = 25;
// Define target counts for specific credit values (e.g., 1x 5-credit, 2x 4-credit, 3x 3-credit)
const TARGET_CREDIT_COUNTS = { 5: 1, 4: 2, 3: 3 };
const REQUIRED_CREDIT_VALUES = Object.keys(TARGET_CREDIT_COUNTS).map(Number); // [5, 4, 3]
const BASE_URL = 'http://localhost:5000/api'; // Your backend API base URL

function CourseEnroll() {
    // --- State Variables ---
    const [availableCourses, setAvailableCourses] = useState([]); // Courses fetched from backend
    const [selectedCourses, setSelectedCourses] = useState(new Set()); // Set of selected course IDs
    const [totalCredits, setTotalCredits] = useState(0); // Sum of credits for selected courses
    const [selectedCreditCounts, setSelectedCreditCounts] = useState(
        // Initialize counts for required credit values to 0
        REQUIRED_CREDIT_VALUES.reduce((acc, val) => ({ ...acc, [val]: 0 }), {})
    );
    const [isLoading, setIsLoading] = useState(true); // Loading state for data fetching/API calls
    const [error, setError] = useState(null); // Stores error messages for display
    const [searchTerm, setSearchTerm] = useState(''); // Input value for searching courses
    const [filterCredits, setFilterCredits] = useState('all'); // Value of credit filter dropdown
    const [sortOption, setSortOption] = useState('name-asc'); // Value of sort dropdown
    const [newCourse, setNewCourse] = useState({ id: '', name: '', credits: '' }); // State for the 'Add Course' form

    const navigate = useNavigate(); // Hook for programmatic navigation

    // --- User Role and Role Checks ---
    const [userRole, setUserRole] = useState(null); // Store the logged-in user's role
    useEffect(() => {
        // Ran once on mount to get the role from storage
        const storedRole = localStorage.getItem('userRole');
        if (!storedRole) {
             console.warn("User role not found in localStorage on component mount.");
             // Optionally set error or rely on fetch logic to handle missing auth
        }
        setUserRole(storedRole);
    }, []); // Empty dependency array ensures it runs once on mount

    // Memoized checks for specific roles based on the userRole state
    const isAdmin = useMemo(() => userRole === 'Admin', [userRole]);
    const isStudent = useMemo(() => userRole === 'Student', [userRole]);


    // --- Helper Function to Get Authorization Headers ---
    const getAuthHeaders = () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error("Authentication token not found in localStorage.");
            // If no token, clear potentially stale user info and redirect to login
            localStorage.removeItem('userRole');
            localStorage.removeItem('userId');
            navigate('/login', { state: { message: "Your session is invalid or has expired. Please log in." }, replace: true });
            return null; // Return null to indicate headers could not be created
        }
        // Return the header object required by Axios
        return { Authorization: `Bearer ${token}` };
    };

    // --- Fetch Available Courses from Backend ---
        // --- Fetch Available Courses from Backend ---
        useEffect(() => {
            // Define helper functions INSIDE the useEffect hook
            const getAuthHeadersInternal = () => { // Renamed slightly to avoid confusion if needed
                const token = localStorage.getItem('authToken');
                if (!token) {
                    console.error("Authentication token not found in localStorage.");
                    localStorage.removeItem('userRole');
                    localStorage.removeItem('userId');
                    // Use navigate safely here as it's listed in the dependency array
                    navigate('/login', { state: { message: "Your session is invalid or has expired. Please log in." }, replace: true });
                    return null;
                }
                return { Authorization: `Bearer ${token}` };
            };
    
            const fetchCoursesInternal = async () => { // Renamed slightly
                 const storedRole = localStorage.getItem('userRole');
                 if (!storedRole) {
                     setError("You must be logged in to view courses.");
                     setIsLoading(false);
                     return;
                 }
    
                setIsLoading(true);
                setError(null);
    
                const headers = getAuthHeadersInternal(); // Call the function defined inside the effect
                if (!headers) {
                     setIsLoading(false);
                     return;
                }
    
                try {
                    const response = await axios.get(`${BASE_URL}/courses`, { headers });
                    if (response.data.success) {
                        const coursesData = Array.isArray(response.data.data) ? response.data.data : [];
                        const sortedInitial = [...coursesData].sort((a, b) =>
                            (a.course_name || '').localeCompare(b.course_name || '')
                        );
                        setAvailableCourses(sortedInitial);
                    } else {
                        throw new Error(response.data.message || "Failed to fetch courses from the server.");
                    }
                } catch (err) {
                    console.error("Failed to load courses:", err);
                    let message = "An error occurred while loading courses. Please try again later.";
                     if (err.response) {
                         if (err.response.status === 401) {
                             message = "Your session has expired or is invalid. Please log out and log back in.";
                             localStorage.clear();
                             navigate('/login', { state: { message: message }, replace: true }); // Use navigate here
                         } else if (err.response.status === 403) {
                              message = "You do not have permission to view these courses.";
                         } else if (err.response.data && err.response.data.message) {
                             message = err.response.data.message;
                         }
                     } else if (err.request) {
                         message = "Network Error: Could not reach the server. Please check your connection.";
                     }
                     setError(message);
                     setAvailableCourses([]);
                } finally {
                    setIsLoading(false);
                }
            };
    
            // Call the fetch function defined inside the effect
            fetchCoursesInternal();
    
        // The effect now only depends on 'navigate' from the outer scope.
        }, [navigate]); // Keep navigate as it's used by getAuthHeadersInternal // Removed userRole dependency, fetch runs once on mount


    // --- Memoized Course Map (adapts backend `course_name` to consistent `name`) ---
    const courseMap = useMemo(() => {
        const map = new Map();
        availableCourses.forEach(course => map.set(course.id, {
            ...course,
            name: course.course_name // Use 'name' property consistently in component logic
        }));
        return map;
    }, [availableCourses]); // Recompute only when availableCourses changes

    // --- Recalculate Selected Totals & Credit Counts ---
    useEffect(() => {
        let currentTotal = 0;
        const counts = REQUIRED_CREDIT_VALUES.reduce((acc, val) => ({ ...acc, [val]: 0 }), {});
        selectedCourses.forEach(courseId => {
            const course = courseMap.get(courseId);
            if (course) {
                currentTotal += course.credits;
                if (Object.prototype.hasOwnProperty.call(counts,course.credits)) {
                    counts[course.credits]++;
                }
            }
        });
        setTotalCredits(currentTotal);
        setSelectedCreditCounts(counts);
    }, [selectedCourses, courseMap]); // Re-run when selection changes or course data changes

    // --- Check if Specific Credit Constraints are Met ---
    const constraintsMet = useMemo(() => {
        return REQUIRED_CREDIT_VALUES.every(
            creditValue => selectedCreditCounts[creditValue] === TARGET_CREDIT_COUNTS[creditValue]
        );
    }, [selectedCreditCounts]); // Recompute only when selected counts change

    // --- Filter and Sort Courses for Display ---
    const displayCourses = useMemo(() => {
        let filtered = Array.from(courseMap.values());
        if (filterCredits !== 'all') {
            const creditValue = parseInt(filterCredits, 10);
            if (!isNaN(creditValue)) {
                 filtered = filtered.filter(course => course.credits === creditValue);
            }
        }
        if (searchTerm.trim() !== '') {
            const lowerSearchTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(course =>
                (course.name || '').toLowerCase().includes(lowerSearchTerm) ||
                (course.id || '').toLowerCase().includes(lowerSearchTerm)
            );
        }
        switch (sortOption) {
            case 'credits-asc':
                filtered.sort((a, b) => a.credits - b.credits || (a.name || '').localeCompare(b.name || ''));
                break;
            case 'credits-desc':
                filtered.sort((a, b) => b.credits - a.credits || (a.name || '').localeCompare(b.name || ''));
                break;
            case 'name-asc':
            default:
                filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
                break;
        }
        return filtered;
    }, [courseMap, searchTerm, filterCredits, sortOption]); // Recompute when dependencies change

    // --- Get Unique Credit Options for Filter Dropdown ---
    const uniqueCreditOptions = useMemo(() => {
        const credits = [...new Set(availableCourses.map(c => c.credits))].sort((a, b) => a - b);
        return ['all', ...credits];
    }, [availableCourses]); // Recompute only when available courses change


    // --- Event Handlers ---

    // Toggle Selection of a Course
    const handleToggleSelect = (courseId) => {
        const course = courseMap.get(courseId);
        if (!course) return;
        const newSelectedCourses = new Set(selectedCourses);
        const isSelected = newSelectedCourses.has(courseId);
        if (isSelected) {
            newSelectedCourses.delete(courseId);
        } else {
            const potentialTotalCredits = totalCredits + course.credits;
            if (potentialTotalCredits > CREDIT_LIMIT) {
                alert(`Cannot select "${course.name}". Adding it would exceed the credit limit of ${CREDIT_LIMIT}. Current total: ${totalCredits}.`);
                return;
            }
            if (Object.prototype.hasOwnProperty.call(selectedCreditCounts,course.credits)) {
                if (selectedCreditCounts[course.credits] >= TARGET_CREDIT_COUNTS[course.credits]) {
                    alert(`Cannot select another ${course.credits}-credit course. You have already selected the maximum allowed (${TARGET_CREDIT_COUNTS[course.credits]}).`);
                    return;
                }
            }
            newSelectedCourses.add(courseId);
        }
        setSelectedCourses(newSelectedCourses);
    };

    // Submit Enrollment (Student Action)
    const handleSubmitEnrollment = async () => {
        if (!isStudent) { alert("Only students are allowed to submit enrollment."); return; }
        if (!constraintsMet) { alert("Please ensure you meet all specific credit requirements (e.g., number of 3/4/5 credit courses) before submitting."); return; }
        if (totalCredits > CREDIT_LIMIT) { alert("Your total selected credits exceed the limit. Please deselect one or more courses."); return; }
        if (selectedCourses.size === 0) { alert("Please select at least one course to enroll."); return; }
        const studentId = localStorage.getItem('userId');
        if (!studentId) { alert("Error: Could not identify student. Please log in again."); return; }
        const enrollmentData = { studentId: studentId, courseIds: Array.from(selectedCourses) };
        console.log("Submitting enrollment data:", enrollmentData);
        alert("Note: Enrollment submission API call is not fully implemented in this example.\nData to be sent:\n" + JSON.stringify(enrollmentData, null, 2));
        // TODO: Implement the actual API call (see previous examples for structure with headers)
    };

    // Add a New Course (Admin Action)
    const handleAddCourse = async () => {
        if (!isAdmin) { alert("Access Denied: Only Administrators can add new courses."); return; }
        const courseId = newCourse.id.trim().toUpperCase();
        const courseName = newCourse.name.trim();
        const creditsStr = newCourse.credits.toString().trim();
        if (!courseId || !courseName || !creditsStr) { alert("Please fill in all fields: Course ID, Course Name, and Credits."); return; }
        const parsedCredits = parseInt(creditsStr, 10);
        if (isNaN(parsedCredits) || parsedCredits < 1 || parsedCredits > 10) { alert("Please enter a valid number for credits (e.g., between 1 and 10)."); return; }
        if (courseMap.has(courseId)) { alert(`Error: A course with ID "${courseId}" already exists. Please use a unique ID.`); return; }
        const courseToAdd = { id: courseId, course_name: courseName, credits: parsedCredits };
        const headers = getAuthHeaders();
        if (!headers) { alert("Authentication required to add a course."); return; }
        try {
            setIsLoading(true);
            const response = await axios.post(`${BASE_URL}/courses`, courseToAdd, { headers });
            if (response.data.success) {
                alert(`Course "${courseToAdd.course_name}" was added successfully!`);
                const addedCourseData = response.data.data || { ...courseToAdd, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
                setAvailableCourses(prev => [...prev, addedCourseData].sort((a, b) => a.course_name.localeCompare(b.course_name)));
                setNewCourse({ id: '', name: '', credits: '' });
            } else { throw new Error(response.data.message || "Server responded with failure while adding course."); }
        } catch (addError) {
            console.error("Error adding course:", addError);
            alert(`Failed to add course: ${addError.response?.data?.message || addError.message}`);
        } finally { setIsLoading(false); }
    };

    // Remove a Course (Admin Action)
    const handleRemoveCourse = async (courseId) => {
        if (!isAdmin) { alert("Access Denied: Only Administrators can remove courses."); return; }
        if (!courseId) return;
        const courseToRemove = courseMap.get(courseId);
        const courseName = courseToRemove?.name || courseId;
        if (!window.confirm(`Are you sure you want to permanently remove the course "${courseName}" (ID: ${courseId})? This action cannot be undone.`)) { return; }
        const headers = getAuthHeaders();
        if (!headers) { alert("Authentication required to remove a course."); return; }
        try {
            setIsLoading(true);
            const response = await axios.delete(`${BASE_URL}/courses/${courseId}`, { headers });
            if (response.status === 200 || response.status === 204) {
                alert(`Course "${courseName}" removed successfully!`);
                setAvailableCourses(prev => prev.filter(course => course.id !== courseId));
                if (selectedCourses.has(courseId)) {
                     setSelectedCourses(prev => { const updated = new Set(prev); updated.delete(courseId); return updated; });
                }
            } else { throw new Error(response.data?.message || 'Failed to remove course due to unexpected server response.'); }
        } catch (removeError) {
            console.error("Error removing course:", removeError);
            alert(`Failed to remove course "${courseName}": ${removeError.response?.data?.message || removeError.message}`);
        } finally { setIsLoading(false); }
    };

    // Helper function to determine text color for constraint status display
    const getConstraintStatusColor = (count, target) => {
        if (count === target) return 'text-green-600';
        if (count > target) return 'text-red-600';
        return 'text-orange-600';
    };


    // --- Render Logic ---

    // 1. Loading State Display
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
            </div>
        );
    }

    // 2. Error State Display (if error occurred during fetch)
    if (error) {
        return (
            <div className="container mx-auto p-4 md:p-6 max-w-3xl text-center">
                 <div className="p-6 bg-red-100 text-red-700 rounded-lg shadow border border-red-300">
                     <h3 className="text-xl font-semibold mb-3">Error Accessing Courses</h3>
                     <p>{error}</p>
                     <button
                         onClick={() => navigate('/login', { replace: true })}
                         className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                     >
                         Return to Login
                     </button>
                 </div>
            </div>
        );
    }

    // 3. Main Content Render (if no loading and no fetch error)
    return (
        // Main container
        <div className="container mx-auto p-4 md:p-6 max-w-7xl">
            {/* Page Title */}
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800 tracking-tight">
                Course Enrollment Portal
            </h3>

            {/* --- Admin: Add New Course Section (Conditionally Rendered) --- */}
            {isAdmin && (
                <div className="bg-white p-4 mb-6 rounded-lg shadow border border-gray-200">
                    <h4 className="text-lg font-semibold mb-3 text-indigo-700 border-b border-gray-300 pb-2">Add New Course (Admin Panel)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        {/* Course ID Input Field */}
                        <div className="md:col-span-1">
                            <label htmlFor="newCourseId" className="block text-sm font-medium text-gray-700 mb-1">Course ID</label>
                             <input
                                id="newCourseId"
                                type="text"
                                placeholder="e.g., CS401"
                                className="border p-2 rounded w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                value={newCourse.id}
                                onChange={e => setNewCourse({ ...newCourse, id: e.target.value })}
                            />
                        </div>
                         {/* Course Name Input Field */}
                         <div className="md:col-span-2">
                             <label htmlFor="newCourseName" className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                            <input
                                id="newCourseName"
                                type="text"
                                placeholder="e.g., Advanced Web Development"
                                className="border p-2 rounded w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                value={newCourse.name}
                                onChange={e => setNewCourse({ ...newCourse, name: e.target.value })}
                            />
                         </div>
                         {/* Credits Input Field */}
                         <div className="md:col-span-1">
                            <label htmlFor="newCourseCredits" className="block text-sm font-medium text-gray-700 mb-1">Credits</label>
                            <input
                                id="newCourseCredits"
                                type="number"
                                placeholder="e.g., 3"
                                min="1"
                                className="border p-2 rounded w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                value={newCourse.credits}
                                onChange={e => setNewCourse({ ...newCourse, credits: e.target.value })}
                             />
                         </div>
                         {/* Add Course Button */}
                         <div className="md:col-start-4 md:col-span-1">
                             <button
                                className="w-full bg-indigo-600 text-white px-5 py-2 rounded shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 h-[42px] text-sm font-medium"
                                onClick={handleAddCourse}
                            >
                                Add Course
                             </button>
                         </div>
                    </div>
                </div>
            )}

            {/* --- Status Bar Section --- */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl shadow-lg mb-8 border border-gray-200 sticky top-4 z-10">
                {/* Display Total Selected Credits vs Limit */}
                <div className="flex justify-between items-center mb-3 border-b border-gray-300 pb-3">
                    <span className="font-semibold text-gray-700 text-sm md:text-base">Selected Credits:</span>
                    <span className={`font-bold text-lg md:text-xl ${totalCredits > CREDIT_LIMIT ? 'text-red-600 animate-pulse' : 'text-green-600'}`}>
                        {totalCredits} / {CREDIT_LIMIT}
                    </span>
                </div>
                {/* Progress Bar visual */}
                <div className="w-full bg-gray-300 rounded-full h-2.5 mb-4 overflow-hidden" title={`Credit Progress: ${totalCredits}/${CREDIT_LIMIT}`}>
                    <div
                        className={`h-full rounded-full transition-all duration-500 ease-out ${totalCredits > CREDIT_LIMIT ? 'bg-red-500' : 'bg-gradient-to-r from-blue-400 to-indigo-600'}`}
                        style={{ width: `${Math.min((totalCredits / CREDIT_LIMIT) * 100, 100)}%` }}
                        role="progressbar" aria-valuenow={totalCredits} aria-valuemin="0" aria-valuemax={CREDIT_LIMIT}
                    ></div>
                </div>
                 {/* Specific Credit Requirements Breakdown (Only shown to Students) */}
                 {isStudent && (
                    <details className="group">
                        <summary className="font-semibold text-gray-700 text-sm cursor-pointer list-none flex justify-between items-center hover:text-indigo-600 transition-colors duration-150">
                            Specific Requirements Status
                            <span className="text-xs transition-transform duration-200 group-open:rotate-180">▼</span>
                        </summary>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 text-xs md:text-sm border-t border-gray-300 pt-2">
                            {REQUIRED_CREDIT_VALUES.map(creditValue => (
                                <div key={creditValue} className="flex justify-between items-center">
                                    <span className="text-gray-600">{creditValue}-Credit Courses:</span>
                                    <span className={`font-semibold py-0.5 px-1.5 rounded ${getConstraintStatusColor(selectedCreditCounts[creditValue], TARGET_CREDIT_COUNTS[creditValue]).replace('text-', 'bg-').replace('-600', '-100')}`}>
                                        {selectedCreditCounts[creditValue]} / {TARGET_CREDIT_COUNTS[creditValue]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </details>
                 )}
                 {/* Warning message if overall credit limit is exceeded */}
                {totalCredits > CREDIT_LIMIT && (
                    <p className="text-red-600 text-xs mt-2 text-center font-medium animate-pulse">Warning: Overall credit limit exceeded!</p>
                )}
            </div>


            {/* --- Filter, Sort, Search Controls --- */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6 border border-gray-200 flex flex-col md:flex-row gap-4 items-center">
                {/* Search Input Field */}
                <div className="relative flex-grow w-full md:w-auto">
                    <input
                        type="text" placeholder="Search by Name or ID..." value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-transparent outline-none text-sm shadow-sm"
                        aria-label="Search available courses" />
                </div>
                {/* Filter by Credits Dropdown */}
                <div className="relative w-full md:w-auto">
                    <select
                        value={filterCredits} onChange={(e) => setFilterCredits(e.target.value)}
                        className="w-full appearance-none px-4 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-transparent outline-none text-sm bg-white shadow-sm cursor-pointer"
                        aria-label="Filter courses by credit value">
                        {uniqueCreditOptions.map(credit => (
                        <option key={credit} value={credit}>
                            {credit === 'all' ? 'Filter Credits (All)' : `${credit} Credit${credit > 1 ? 's' : ''}`}
                        </option>
                        ))}
                    </select>
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">▼</span>
                </div>
                {/* Sort Courses Dropdown */}
                <div className="relative w-full md:w-auto">
                    <select
                        value={sortOption} onChange={(e) => setSortOption(e.target.value)}
                        className="w-full appearance-none px-4 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-transparent outline-none text-sm bg-white shadow-sm cursor-pointer"
                        aria-label="Sort courses">
                        <option value="name-asc">Sort: Name (A-Z)</option>
                        <option value="credits-asc">Sort: Credits (Low-High)</option>
                        <option value="credits-desc">Sort: Credits (High-Low)</option>
                    </select>
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">▼</span>
                </div>
            </div>


            {/* --- Available Courses List Section --- */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-gray-200 min-h-[300px]">
                <h4 className="text-xl font-semibold mb-5 text-gray-700 border-b border-gray-300 pb-2"> Available Courses ({displayCourses.length}) </h4>
                {displayCourses.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {displayCourses.map((course) => {
                            const courseName = course.name;
                            const isSelected = selectedCourses.has(course.id);
                            let isSelectDisabled = false;
                            let selectDisabledReason = '';
                            if (isStudent && !isSelected) {
                                if (totalCredits + course.credits > CREDIT_LIMIT) {
                                     isSelectDisabled = true; selectDisabledReason = 'Adding this course exceeds the total credit limit.';
                                } else if (Object.prototype.hasOwnProperty.call(selectedCreditCounts,course.credits) && selectedCreditCounts[course.credits] >= TARGET_CREDIT_COUNTS[course.credits]) {
                                     isSelectDisabled = true; selectDisabledReason = `Maximum number of ${course.credits}-credit courses already selected.`;
                                }
                            }
                            return (
                                // Course Item Div
                                <div
                                    key={course.id} title={isSelectDisabled ? selectDisabledReason : ''}
                                    className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg transition-all duration-200 ease-in-out shadow-sm hover:shadow-md ${isSelected ? 'bg-gradient-to-r from-blue-50 to-indigo-100 border-indigo-300 ring-1 ring-indigo-200' : 'border-gray-200 bg-white'} ${isSelectDisabled && !isSelected ? 'opacity-65 cursor-not-allowed' : ''}`}>
                                    {/* Course Info */}
                                    <div className="mb-3 sm:mb-0 flex-grow mr-4">
                                        <p className="font-semibold text-base text-gray-800">{courseName}</p>
                                        <p className="text-sm text-gray-500">
                                            <span className="font-medium">ID:</span> {course.id} | <span className="font-medium">Credits:</span> {course.credits}
                                        </p>
                                        {isSelectDisabled && <p className="text-xs text-red-500 mt-1">{selectDisabledReason}</p>}
                                    </div>
                                    {/* Action Buttons */}
                                    <div className="flex items-center flex-shrink-0 mt-2 sm:mt-0 space-x-3">
                                        {/* Select/Deselect Button (Student) */}
                                        {isStudent && (
                                            <button
                                                onClick={() => handleToggleSelect(course.id)} disabled={isSelectDisabled && !isSelected}
                                                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 shadow-sm border whitespace-nowrap ${ isSelected ? 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200 active:bg-red-300' : (isSelectDisabled ? 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed' : 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200 active:bg-green-300 hover:shadow-md')}`}
                                                aria-label={isSelected ? `Deselect ${courseName}` : `Select ${courseName}`}>
                                                {isSelected ? (<><span className="font-bold text-base leading-none -mt-0.5">×</span> Deselect</>) : (<><span className="font-bold text-base leading-none -mt-0.5">+</span> Select</>)}
                                            </button>
                                        )}
                                        {/* Remove Button (Admin) */}
                                        {isAdmin && (
                                            <button
                                                onClick={() => handleRemoveCourse(course.id)}
                                                className="text-gray-400 hover:text-red-600 hover:bg-red-100 rounded p-1.5 transition-colors duration-150"
                                                aria-label={`Remove ${courseName}`} title="Remove Course (Admin Only)">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div> // End Course Item Div
                            );
                        })}
                    </div> // End Grid
                ) : (
                     // "No Courses Found" Message
                    <div className="text-center py-16 text-gray-500">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                           <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No Courses Found</h3>
                         <p className="mt-1 text-sm text-gray-500">
                             {availableCourses.length === 0 ? "There are currently no courses configured in the system." : "No courses match your current filter or search criteria."}
                         </p>
                         {isAdmin && availableCourses.length === 0 && (
                             <button
                                 onClick={() => { const firstInput = document.getElementById('newCourseId'); firstInput?.focus({ preventScroll: false }); }}
                                 className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Add the First Course
                             </button>
                         )}
                    </div> // End No Courses Found Message
                )}
            </div> // End Courses List Section

            {/* --- Student: Submit Enrollment Button Section --- */}
             {isStudent && (
                 <div className="mt-10 text-center">
                     <button
                        onClick={handleSubmitEnrollment}
                        disabled={!constraintsMet || totalCredits > CREDIT_LIMIT || selectedCourses.size === 0}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold px-10 py-3 rounded-lg shadow-lg hover:shadow-xl hover:from-green-600 hover:to-emerald-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-green-500 disabled:hover:to-emerald-600 transform hover:scale-105 disabled:transform-none">
                         Submit Enrollment ({selectedCourses.size} {selectedCourses.size === 1 ? 'Course' : 'Courses'})
                     </button>
                     {!constraintsMet && selectedCourses.size > 0 && totalCredits <= CREDIT_LIMIT && (
                        <p className="text-orange-600 text-sm mt-3 font-medium">Note: Specific credit requirements are not yet met.</p>
                     )}
                     {totalCredits > CREDIT_LIMIT && (
                           <p className="text-red-600 text-sm mt-3 font-medium">Error: Total credits exceed the limit ({CREDIT_LIMIT}).</p>
                     )}
                 </div>
             )}

        </div> // End of main container
    );
}

export default CourseEnroll;