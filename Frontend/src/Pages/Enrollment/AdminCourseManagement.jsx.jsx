// Frontend/src/Pages/Admin/AdminCourseManagement.jsx (Example Path)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:5000/api';

function AdminCourseManagement() {
    const [baseCourses, setBaseCourses] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [offerings, setOfferings] = useState([]); // facultyCourse links with details

    const [newBaseCourse, setNewBaseCourse] = useState({ id: '', name: '', credits: '' });
    const [newOffering, setNewOffering] = useState({ courseId: '', facultyId: '' });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // --- Auth Headers ---
    const getAuthHeaders = () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login', { state: { message: "Session expired." }, replace: true });
            return null;
        }
        return { Authorization: `Bearer ${token}` };
    };

     // --- Generic Error Handler ---
     const handleApiError = (err, context) => {
        console.error(`Error ${context}:`, err);
        let message = `An error occurred while ${context}.`;
        if (err.response) {
            message = err.response.data?.message || message;
            if (err.response.status === 401 || err.response.status === 403) {
                navigate('/login', { state: { message: "Authentication/Authorization error." }, replace: true });
            }
        } else if (err.request) message = "Network Error.";
        setError(message);
        alert(message);
     };

    // --- Data Fetching ---
    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        const headers = getAuthHeaders();
        if (!headers) { setIsLoading(false); return; }

        try {
            const [coursesRes, facultiesRes, offeringsRes] = await Promise.all([
                axios.get(`${BASE_URL}/courses`, { headers }),     // Base courses
                axios.get(`${BASE_URL}/faculty`, { headers }),     // All faculties (Needs GET /api/faculty endpoint)
                axios.get(`${BASE_URL}/offerings`, { headers })    // All Offerings (Needs GET /api/offerings endpoint)
            ]);

            setBaseCourses(coursesRes.data.success ? (Array.isArray(coursesRes.data.data) ? coursesRes.data.data : []) : []);
            setFaculties(facultiesRes.data.success ? (Array.isArray(facultiesRes.data.data) ? facultiesRes.data.data : []) : []);
            setOfferings(offeringsRes.data.success ? (Array.isArray(offeringsRes.data.data) ? offeringsRes.data.data : []) : []);

        } catch (err) {
            handleApiError(err, "fetching admin data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- Handlers ---
    const handleAddBaseCourse = async () => {
        const { id, name, credits } = newBaseCourse;
        if (!id || !name || !credits) { alert("Please fill all base course fields."); return; }
        const headers = getAuthHeaders(); if (!headers) return;
        setError(null);

        try {
            const payload = { id: id.trim().toUpperCase(), course_name: name.trim(), credits: parseInt(credits) };
            const response = await axios.post(`${BASE_URL}/courses`, payload, { headers });
            if (response.data.success) {
                alert("Base course added successfully!");
                setNewBaseCourse({ id: '', name: '', credits: '' });
                fetchData(); // Refresh all data
            } else { throw new Error(response.data.message); }
        } catch (err) { handleApiError(err, "adding base course"); }
    };

    const handleRemoveBaseCourse = async (courseId) => {
        if (!window.confirm(`Remove BASE course ${courseId}? This may fail if offerings exist.`)) return;
        const headers = getAuthHeaders(); if (!headers) return;
        setError(null);

        try {
            const response = await axios.delete(`${BASE_URL}/courses/${courseId}`, { headers });
             // Status 200 or 204 indicate success
             if (response.status === 200 || response.status === 204) {
                 alert("Base course removed successfully!");
                 fetchData(); // Refresh all data
             } else { throw new Error(response.data?.message || 'Failed to remove course.'); }
        } catch (err) { handleApiError(err, "removing base course"); }
    };

    const handleCreateOffering = async () => {
        const { courseId, facultyId } = newOffering;
        if (!courseId || !facultyId) { alert("Please select both a course and a faculty."); return; }
        const headers = getAuthHeaders(); if (!headers) return;
        setError(null);

        try {
            const payload = { course_id: courseId, faculty_id: facultyId };
            // Use the dedicated endpoint for linking
            const response = await axios.post(`${BASE_URL}/facultycourses`, payload, { headers });
            if (response.data.success) {
                alert("Offering created successfully!");
                setNewOffering({ courseId: '', facultyId: '' });
                fetchData(); // Refresh all data
            } else { throw new Error(response.data.message); }
        } catch (err) { handleApiError(err, "creating offering"); }
    };

    const handleRemoveOffering = async (offeringId) => { // offeringId is facultyCourse.id
        if (!window.confirm(`Remove this specific offering link (ID: ${offeringId})? This may fail if students are enrolled.`)) return;
        const headers = getAuthHeaders(); if (!headers) return;
        setError(null);

        try {
             // Use the dedicated endpoint for deleting the link
            const response = await axios.delete(`${BASE_URL}/offerings/${offeringId}`, { headers });
            if (response.status === 200 || response.status === 204) {
                 alert("Offering removed successfully!");
                 fetchData(); // Refresh all data
             } else { throw new Error(response.data?.message || 'Failed to remove offering.'); }
        } catch (err) { handleApiError(err, "removing offering"); }
    };

    // --- Render ---
    if (isLoading) return <div className="text-center p-10">Loading Admin Data...</div>;

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Admin Course Management</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300">
                    <strong>Error:</strong> {error}
                    <button onClick={() => setError(null)} className="float-right font-bold text-red-500">×</button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* --- Base Course Management --- */}
                <section className="bg-white p-4 rounded-lg shadow border">
                    <h3 className="text-xl font-semibold mb-4 text-indigo-700 border-b pb-2">Manage Base Courses</h3>
                    {/* Add Form */}
                    <div className="mb-6 space-y-2">
                        <h4 className="text-md font-semibold">Add New Base Course</h4>
                         <div>
                             <label htmlFor="bcId" className="text-sm font-medium">ID</label>
                             <input type="text" id="bcId" value={newBaseCourse.id} onChange={e => setNewBaseCourse({...newBaseCourse, id: e.target.value})} className="border p-2 rounded w-full text-sm" placeholder="e.g., MATH101"/>
                         </div>
                         <div>
                             <label htmlFor="bcName" className="text-sm font-medium">Name</label>
                             <input type="text" id="bcName" value={newBaseCourse.name} onChange={e => setNewBaseCourse({...newBaseCourse, name: e.target.value})} className="border p-2 rounded w-full text-sm" placeholder="e.g., Calculus I"/>
                         </div>
                         <div>
                             <label htmlFor="bcCredits" className="text-sm font-medium">Credits</label>
                             <input type="number" id="bcCredits" min="1" value={newBaseCourse.credits} onChange={e => setNewBaseCourse({...newBaseCourse, credits: e.target.value})} className="border p-2 rounded w-full text-sm" placeholder="e.g., 4"/>
                         </div>
                         <button onClick={handleAddBaseCourse} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 text-sm font-medium">Add Base Course</button>
                    </div>

                    {/* List Existing */}
                    <div>
                        <h4 className="text-md font-semibold mb-2 border-t pt-4">Existing Base Courses ({baseCourses.length})</h4>
                        <ul className="text-sm max-h-60 overflow-y-auto space-y-1">
                            {baseCourses.length > 0 ? baseCourses.map(c => (
                                <li key={c.id} className="flex justify-between items-center p-1.5 bg-gray-50 rounded border">
                                    <span>{c.id} - {c.course_name} ({c.credits} Cr)</span>
                                    <button onClick={() => handleRemoveBaseCourse(c.id)} className="text-red-500 hover:text-red-700 font-bold px-2 py-0.5 text-xs">Remove</button>
                                </li>
                            )) : <li className="text-gray-500">No base courses found.</li>}
                        </ul>
                    </div>
                </section>

                {/* --- Offering Management --- */}
                <section className="bg-white p-4 rounded-lg shadow border">
                    <h3 className="text-xl font-semibold mb-4 text-indigo-700 border-b pb-2">Manage Course Offerings</h3>
                    {/* Add Form */}
                    <div className="mb-6 space-y-2">
                        <h4 className="text-md font-semibold">Create New Offering (Link Course & Faculty)</h4>
                        <div>
                            <label htmlFor="offCourse" className="text-sm font-medium">Select Course</label>
                            <select id="offCourse" value={newOffering.courseId} onChange={e => setNewOffering({...newOffering, courseId: e.target.value})} className="border p-2 rounded w-full text-sm appearance-none pr-8 bg-white" required>
                                <option value="" disabled>-- Select Course --</option>
                                {baseCourses.map(c => <option key={c.id} value={c.id}>{c.id} - {c.course_name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="offFaculty" className="text-sm font-medium">Select Faculty</label>
                            <select id="offFaculty" value={newOffering.facultyId} onChange={e => setNewOffering({...newOffering, facultyId: e.target.value})} className="border p-2 rounded w-full text-sm appearance-none pr-8 bg-white" required>
                                <option value="" disabled>-- Select Faculty --</option>
                                {faculties.map(f => <option key={f.id} value={f.id}>{f.name} (ID: {f.id})</option>)}
                            </select>
                        </div>
                        <button onClick={handleCreateOffering} className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 text-sm font-medium">Create Offering Link</button>
                    </div>

                    {/* List Existing */}
                    <div>
                        <h4 className="text-md font-semibold mb-2 border-t pt-4">Existing Offerings ({offerings.length})</h4>
                        <ul className="text-sm max-h-60 overflow-y-auto space-y-1">
                            {offerings.length > 0 ? offerings.map(o => (
                                <li key={o.id} className="flex justify-between items-center p-1.5 bg-gray-50 rounded border">
                                    <span>{o.course?.course_name || '?'} ({o.course?.id || '?'}) - {o.faculty?.name || '?'}</span>
                                    <button onClick={() => handleRemoveOffering(o.id)} className="text-red-500 hover:text-red-700 font-bold px-2 py-0.5 text-xs">Remove</button>
                                </li>
                            )) : <li className="text-gray-500">No offerings found.</li>}
                        </ul>
                    </div>
                </section>

            </div>
        </div>
    );
}

export default AdminCourseManagement;