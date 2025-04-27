// Frontend/src/Pages/Admin/AdminCourseManagement.jsx
import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// **** VERIFY: Ensure this matches your actual backend host and port ****
const BASE_URL = 'http://localhost:5000/api';

function AdminCourseManagement() {
    const [baseCourses, setBaseCourses] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [offerings, setOfferings] = useState([]); // facultyCourse links with details

    const [newBaseCourse, setNewBaseCourse] = useState({ id: '', name: '', credits: '' });
    // **** STEP 1: Add capacity to newOffering state ****
    const [newOffering, setNewOffering] = useState({ courseId: '', facultyId: '', capacity: '' }); // Initialize capacity

    const [isLoading, setIsLoading] = useState(true); // Handles loading for all fetches/actions
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // --- Auth Headers (Memoized) ---
    const getAuthHeaders = useCallback(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.warn("Admin Auth token not found, redirecting to login.");
            navigate('/login', { state: { message: "Session expired. Please log in again." }, replace: true });
            return null;
        }
        return { Authorization: `Bearer ${token}` };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]);

     // --- Generic Error Handler (Memoized) ---
     const handleApiError = useCallback((err, context) => {
        console.error(`Error ${context}:`, err); // Log the full error
        let message = `An error occurred while ${context}. Please try again.`;
        if (err.response) {
            // Use specific backend message if available
            message = err.response.data?.message || `Server error (${err.response.status}) while ${context}.`;
            if (err.response.status === 401 || err.response.status === 403) {
                console.warn(`Admin Auth error (${err.response.status}). Redirecting.`);
                localStorage.removeItem('authToken'); // Clear token
                navigate('/login', { state: { message: "Authentication/Authorization error." }, replace: true });
                // Set error briefly, navigation is primary
                setError("Authentication/Authorization error.");
                return; // Stop processing for auth errors
            }
             // For other errors (400, 404, 409, 500), just set the error state for display
        } else if (err.request) {
            message = "Network Error: Could not reach the server.";
        } else {
             message = `Client-side error during ${context}: ${err.message}`;
        }
        setError(message);
        // Consider a toast notification system instead of alert
        // alert(message);
     // eslint-disable-next-line react-hooks/exhaustive-deps
     }, [navigate]);

    // --- Data Fetching (Memoized) ---
    const fetchData = useCallback(async () => {
        setIsLoading(true); // Set loading true at the start
        setError(null); // Clear previous errors
        const headers = getAuthHeaders();
        if (!headers) {
            setIsLoading(false); // Stop loading if auth fails early
            return;
        }
        console.log("Fetching admin data...");

        try {
            // **** VERIFY: Ensure these endpoints exist and return correct data structure ****
            // GET /offerings should ideally return capacity and enrollmentCount now
            const [coursesRes, facultiesRes, offeringsRes] = await Promise.all([
                axios.get(`${BASE_URL}/courses`, { headers }),
                axios.get(`${BASE_URL}/faculty`, { headers }), // Ensure /faculty returns list of faculties
                axios.get(`${BASE_URL}/offerings`, { headers }) // Expects nested course/faculty + capacity + enrollmentCount
            ]);

            // Safely set state, default to empty array if API response is malformed
            setBaseCourses(coursesRes.data?.success && Array.isArray(coursesRes.data.data) ? coursesRes.data.data : []);
            setFaculties(facultiesRes.data?.success && Array.isArray(facultiesRes.data.data) ? facultiesRes.data.data : []);
            setOfferings(offeringsRes.data?.success && Array.isArray(offeringsRes.data.data) ? offeringsRes.data.data : []);
            console.log("Admin data fetched successfully.");

        } catch (err) {
            handleApiError(err, "fetching admin data");
            // Clear state on major fetch error
            setBaseCourses([]);
            setFaculties([]);
            setOfferings([]);
        } finally {
            setIsLoading(false); // Set loading false at the end
        }
    }, [getAuthHeaders, handleApiError]); // Dependencies

    // Initial fetch
    useEffect(() => {
        fetchData();
    }, [fetchData]); // Use fetchData as dependency

    // --- Handlers ---
    const handleAddBaseCourse = async () => {
        setError(null);
        const { id, name, credits } = newBaseCourse;
        const creditsInt = parseInt(credits, 10);

        if (!id || !name || !credits || isNaN(creditsInt) || creditsInt <= 0) {
             alert("Please fill all base course fields with valid data (ID, Name, positive Credits).");
             return;
        }
        const headers = getAuthHeaders(); if (!headers) return;
        setIsLoading(true); // Indicate activity

        try {
            const payload = { id: id.trim().toUpperCase(), course_name: name.trim(), credits: creditsInt };
            console.log("Adding base course with payload:", payload);
            const response = await axios.post(`${BASE_URL}/courses`, payload, { headers });

            if (response.data && response.data.success) {
                alert("Base course added successfully!");
                setNewBaseCourse({ id: '', name: '', credits: '' });
                fetchData(); // Refresh data (will set isLoading to false via finally block)
            } else {
                throw new Error(response.data?.message || "Failed to add base course.");
            }
        } catch (err) {
             handleApiError(err, "adding base course");
             setIsLoading(false); // Ensure loading stops on error if fetchData isn't called
        }
        // No finally here, fetchData handles the final setIsLoading(false)
    };

    const handleRemoveBaseCourse = async (courseId) => {
        if (!window.confirm(`Are you sure you want to remove BASE course ${courseId}? Offerings using this course must be removed first.`)) return;
        setError(null);
        const headers = getAuthHeaders(); if (!headers) return;
        setIsLoading(true);

        try {
            console.log(`Removing base course: ${courseId}`);
            const response = await axios.delete(`${BASE_URL}/courses/${courseId}`, { headers });

             if (response.status === 200 || response.status === 204) {
                 alert("Base course removed successfully!");
                 fetchData(); // Refresh
             } else {
                  throw new Error(response.data?.message || 'Failed to remove base course.');
             }
        } catch (err) {
             handleApiError(err, "removing base course");
             setIsLoading(false);
        }
    };

    // **** STEP 3: Update handler to include capacity ****
    const handleCreateOffering = async () => {
        setError(null);
        // Destructure capacity along with other fields
        const { courseId, facultyId, capacity } = newOffering;
        const capacityInt = parseInt(capacity, 10); // Parse capacity

        // Validate all fields including capacity
        if (!courseId || !facultyId || capacity === '' || isNaN(capacityInt) || capacityInt < 0) {
             alert("Please select a course, a faculty, and enter a valid non-negative capacity (number of seats).");
             return;
        }

        const headers = getAuthHeaders(); if (!headers) return;
        setIsLoading(true);

        try {
            // Include capacity in the payload sent to the backend
            const payload = { course_id: courseId, faculty_id: parseInt(facultyId, 10), capacity: capacityInt }; // Ensure facultyId is integer if needed
            console.log("Creating offering with payload:", payload);

            // **** VERIFY: Endpoint should be POST /facultycourses (as per previous controller) ****
            const response = await axios.post(`${BASE_URL}/facultycourses`, payload, { headers });

            if (response.data && response.data.success) {
                // Use the specific message from the backend if available
                alert(response.data.message || "Offering created successfully!");
                setNewOffering({ courseId: '', facultyId: '', capacity: '' }); // Reset the form fully
                fetchData(); // Refresh data
            } else {
                 throw new Error(response.data?.message || "Failed to create offering on server.");
            }
        } catch (err) {
             handleApiError(err, "creating offering");
             setIsLoading(false);
        }
    };

    const handleRemoveOffering = async (offeringId) => {
        if (!window.confirm(`Are you sure you want to remove this specific offering (ID: ${offeringId})? Students enrolled must be removed first.`)) return;
        setError(null);
        const headers = getAuthHeaders(); if (!headers) return;
        setIsLoading(true);

        try {
            console.log(`Removing offering: ${offeringId}`);
            // **** VERIFY: Ensure endpoint DELETE /offerings/:id or /facultycourses/:id is correct ****
            const response = await axios.delete(`${BASE_URL}/offerings/${offeringId}`, { headers });

             if (response.status === 200 || response.status === 204) {
                 alert("Offering removed successfully!");
                 fetchData(); // Refresh
             } else {
                 throw new Error(response.data?.message || 'Failed to remove offering.');
             }
        } catch (err) {
             handleApiError(err, "removing offering");
             setIsLoading(false);
        }
    };


    // --- Render ---
    // Initial loading state
    if (isLoading && offerings.length === 0 && baseCourses.length === 0 && faculties.length === 0) {
        return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div></div>;
    }

    // Critical error state (failed initial load)
    if (error && offerings.length === 0 && baseCourses.length === 0 && faculties.length === 0 && !isLoading) {
        return <div className="container mx-auto p-6 text-center"> <div className="p-6 bg-red-100 text-red-700 rounded-lg shadow border border-red-300"> <h3 className="text-xl font-semibold mb-3">Error Loading Admin Data</h3> <p>{error}</p> <button onClick={fetchData} disabled={isLoading} className="mt-4 mr-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"> {isLoading ? 'Retrying...' : 'Retry'} </button> </div> </div>;
    }

    // Main Render
    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Admin Course Management</h2>

             {/* Display non-critical errors / background loading status */}
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300 shadow">
                    <strong>Error:</strong> {error}
                    <button onClick={() => setError(null)} className="float-right font-bold text-red-600 hover:text-red-800 px-2 text-lg leading-none" aria-label="Dismiss error">×</button>
                </div>
            )}
             {isLoading && <div className="text-center text-sm text-gray-500 mb-4 italic">Processing...</div>}


            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* --- Base Course Management --- */}
                <section className="bg-white p-4 rounded-lg shadow border">
                    <h3 className="text-xl font-semibold mb-4 text-indigo-700 border-b pb-2">Manage Base Courses</h3>
                    {/* Add Form */}
                    <div className="mb-6 space-y-3">
                        <h4 className="text-md font-semibold">Add New Base Course</h4>
                         <div>
                             <label htmlFor="bcId" className="block text-sm font-medium text-gray-700 mb-1">Course ID</label>
                             <input type="text" id="bcId" value={newBaseCourse.id} onChange={e => setNewBaseCourse({...newBaseCourse, id: e.target.value.toUpperCase().trim()})} className="border p-2 rounded w-full text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g., CS101" required/>
                         </div>
                         <div>
                             <label htmlFor="bcName" className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                             <input type="text" id="bcName" value={newBaseCourse.name} onChange={e => setNewBaseCourse({...newBaseCourse, name: e.target.value})} className="border p-2 rounded w-full text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g., Introduction to Programming" required/>
                         </div>
                         <div>
                             <label htmlFor="bcCredits" className="block text-sm font-medium text-gray-700 mb-1">Credits</label>
                             <input type="number" id="bcCredits" min="0" step="1" value={newBaseCourse.credits} onChange={e => setNewBaseCourse({...newBaseCourse, credits: e.target.value})} className="border p-2 rounded w-full text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g., 3" required/>
                         </div>
                         <button onClick={handleAddBaseCourse} disabled={isLoading} className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 text-sm font-medium disabled:opacity-50">
                             {isLoading ? 'Adding...' : 'Add Base Course'}
                         </button>
                    </div>

                    {/* List Existing Base Courses */}
                    <div>
                        <h4 className="text-md font-semibold mb-2 border-t pt-4">Existing Base Courses ({baseCourses.length})</h4>
                        <div className="max-h-60 overflow-y-auto border rounded p-2 bg-gray-50">
                            <ul className="text-sm space-y-1">
                                {baseCourses.length > 0 ? baseCourses.map(c => (
                                    <li key={c.id} className="flex justify-between items-center p-1.5 bg-white rounded border border-gray-200 shadow-sm">
                                        <span>
                                            <span className="font-semibold">{c.id}</span> - {c.course_name} ({c.credits} Cr)
                                        </span>
                                        <button onClick={() => handleRemoveBaseCourse(c.id)} disabled={isLoading} className="text-red-500 hover:text-red-700 font-bold px-2 py-0.5 text-xs disabled:opacity-50">Remove</button>
                                    </li>
                                )) : <li className="text-gray-500 italic p-2">No base courses found.</li>}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* --- Offering Management --- */}
                <section className="bg-white p-4 rounded-lg shadow border">
                    <h3 className="text-xl font-semibold mb-4 text-indigo-700 border-b pb-2">Manage Course Offerings</h3>
                    {/* Add Offering Form */}
                    <div className="mb-6 space-y-3">
                        <h4 className="text-md font-semibold">Create New Offering</h4>
                        {/* Course Selection */}
                        <div>
                            <label htmlFor="offCourse" className="block text-sm font-medium text-gray-700 mb-1">Select Course</label>
                            <select id="offCourse" value={newOffering.courseId} onChange={e => setNewOffering({...newOffering, courseId: e.target.value})} className="border p-2 rounded w-full text-sm appearance-none pr-8 bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required>
                                <option value="" disabled>-- Select Course --</option>
                                {baseCourses.sort((a,b) => a.id.localeCompare(b.id)).map(c => <option key={c.id} value={c.id}>{c.id} - {c.course_name}</option>)}
                            </select>
                        </div>
                        {/* Faculty Selection */}
                        <div>
                            <label htmlFor="offFaculty" className="block text-sm font-medium text-gray-700 mb-1">Select Faculty</label>
                            <select id="offFaculty" value={newOffering.facultyId} onChange={e => setNewOffering({...newOffering, facultyId: e.target.value})} className="border p-2 rounded w-full text-sm appearance-none pr-8 bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required>
                                <option value="" disabled>-- Select Faculty --</option>
                                 {faculties.sort((a,b) => a.name.localeCompare(b.name)).map(f => <option key={f.id} value={f.id}>{f.name} (ID: {f.id})</option>)}
                            </select>
                        </div>
                         {/* **** STEP 2: Add Capacity Input Field **** */}
                        <div>
                             <label htmlFor="offCapacity" className="block text-sm font-medium text-gray-700 mb-1">Capacity (Seats)</label>
                             <input
                                type="number"
                                id="offCapacity"
                                min="0" // Allow 0 capacity if needed
                                step="1"
                                value={newOffering.capacity}
                                // Update state, ensuring it stays a string for the input field
                                onChange={e => setNewOffering({...newOffering, capacity: e.target.value})}
                                className="border p-2 rounded w-full text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter max number of students"
                                required
                            />
                        </div>
                        {/* End Capacity Input Field */}
                        {/* Submit Button */}
                        <button onClick={handleCreateOffering} disabled={isLoading} className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 text-sm font-medium disabled:opacity-50">
                             {isLoading ? 'Creating...' : 'Create Offering'}
                        </button>
                    </div>

                    {/* List Existing Offerings */}
                    <div>
                        <h4 className="text-md font-semibold mb-2 border-t pt-4">Existing Offerings ({offerings.length})</h4>
                         <div className="max-h-60 overflow-y-auto border rounded p-2 bg-gray-50">
                            <ul className="text-sm space-y-1">
                                {offerings.length > 0 ? offerings.sort((a,b) => (a.course?.id || '').localeCompare(b.course?.id || '')).map(o => (
                                    <li key={o.id} className="flex justify-between items-center p-1.5 bg-white rounded border border-gray-200 shadow-sm">
                                        {/* Display Offering Details including Seats */}
                                        <div>
                                            <span className="font-semibold">{o.course?.id || '?'}</span> - {o.course?.course_name || 'Unknown Course'} <br />
                                            <span className="text-xs text-gray-600">
                                                Faculty: {o.faculty?.name || 'Unknown Faculty'} |
                                                {/* **** STEP 4 (Optional): Display Capacity/Seats **** */}
                                                <span className="ml-1 font-medium">
                                                     Seats: {o.enrollmentCount ?? '?'}/{o.capacity ?? '?'}
                                                </span>
                                            </span>
                                        </div>
                                        {/* Remove Button */}
                                        <button onClick={() => handleRemoveOffering(o.id)} disabled={isLoading} className="text-red-500 hover:text-red-700 font-bold px-2 py-0.5 text-xs self-center ml-2 flex-shrink-0 disabled:opacity-50">Remove</button>
                                    </li>
                                )) : <li className="text-gray-500 italic p-2">No offerings found.</li>}
                            </ul>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}

export default AdminCourseManagement;