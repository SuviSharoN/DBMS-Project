// Frontend/src/Pages/Enrollment/StudentEnrollment.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- Constants ---
const CREDIT_LIMIT = 22;
// **** VERIFY: Ensure this matches your actual backend host and port ****
const BASE_URL = 'http://localhost:5000/api';

function StudentEnrollment() {
    // State specific to student enrollment
    const [availableOfferings, setAvailableOfferings] = useState([]); // Holds full offering objects including seat data
    const [selectedOfferings, setSelectedOfferings] = useState(new Set()); // Stores facultyCourse IDs
    const [totalCredits, setTotalCredits] = useState(0);
    const [isLoading, setIsLoading] = useState(true); // For initial load and subsequent fetches/submissions
    const [error, setError] = useState(null); // Stores error messages for display
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCredits, setFilterCredits] = useState('all');
    const [sortOption, setSortOption] = useState('course-name-asc');
    const navigate = useNavigate();

    // --- Auth Headers (Memoized) ---
    const getAuthHeaders = useCallback(() => {
         const token = localStorage.getItem('authToken');
         if (!token) {
             console.warn("Auth token not found, redirecting to login.");
             // Clear potentially sensitive state before redirecting
             setAvailableOfferings([]);
             setSelectedOfferings(new Set());
             setTotalCredits(0);
             navigate('/login', { state: { message: "Session expired. Please log in again." }, replace: true });
             return null; // Indicate failure to get headers
         }
         return { Authorization: `Bearer ${token}` };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]); // Add navigate to dependency array

     // --- Generic Error Handler (Memoized) ---
     const handleApiError = useCallback((err, context) => {
        console.error(`Error ${context}:`, err); // Log the full error object for debugging
        let message = `An error occurred while ${context}. Please try again later.`; // Generic default

        if (err.response) {
            // We got a response from the server (like 4xx, 5xx)
            const status = err.response.status;
            // Try to get the specific message from backend first
            message = err.response.data?.message || `Server error (${status}) while ${context}.`;

            if (status === 401 || status === 403) {
                // Authentication/Authorization Error
                console.warn(`Auth error (${status}) detected. Clearing token and redirecting.`);
                localStorage.removeItem('authToken'); // Remove the invalid token
                setAvailableOfferings([]); // Clear state
                setSelectedOfferings(new Set());
                setTotalCredits(0);
                navigate('/login', { state: { message: "Authentication/Authorization error. Please log in again." }, replace: true });
                setError("Authentication/Authorization error."); // Set error briefly
            } else {
                // For other server errors (like 400 validation, 404 not found, 500 internal), just display the message
                setError(message);
            }
        } else if (err.request) {
            // The request was made but no response was received (Network Error)
            message = "Network Error: Could not reach the server. Please check your connection.";
            setError(message);
        } else {
            // Something happened in setting up the request that triggered an Error (Client-side)
            message = `Client-side error during ${context}: ${err.message}`;
            setError(message);
        }
     // eslint-disable-next-line react-hooks/exhaustive-deps
     }, [navigate]); // Added navigate dependency

    // --- Data Fetching (Memoized) ---
    const fetchOfferings = useCallback(async () => {
         setIsLoading(true);
         setError(null); // Clear previous errors before fetching

         const headers = getAuthHeaders();
         if (!headers) {
             console.log("Fetch aborted: No auth headers.");
             setIsLoading(false); // Ensure loading is stopped if headers fail
             return;
         }

         try {
             // **** VERIFY: Ensure this endpoint is correct and returns the expected structure ****
             // Endpoint MUST return: id, capacity, enrollmentCount, nested course{id, name, credits}, faculty{id, name}
             console.log(`Fetching offerings from ${BASE_URL}/offerings`);
             const response = await axios.get(`${BASE_URL}/offerings`, { headers });
             console.log("API Response:", response); // Log the raw response

             // **** CRUCIAL: Robust data validation ****
             if (response.data && response.data.success === true && Array.isArray(response.data.data)) {
                 const offeringsData = response.data.data;
                 console.log("Offerings Data Received:", offeringsData);

                 const validatedOfferings = offeringsData.map(o => {
                    // --- Safe Parsing & Defaulting ---
                    const id = o?.id ?? null;
                    const courseId = o?.course?.id ?? '?';
                    const courseName = o?.course?.course_name ?? 'Unknown Course';
                    const courseCredits = typeof o?.course?.credits === 'number' ? o.course.credits : 0;
                    const facultyId = o?.faculty?.id ?? '?';
                    const facultyName = o?.faculty?.name ?? 'Unknown Faculty';
                    const capacity = typeof o?.capacity === 'number' ? o.capacity : 0;

                    // Safely parse enrollmentCount (handle string or number from backend)
                    let enrollmentCountRaw = o?.enrollmentCount;
                    let enrollmentCount = 0;
                    if (typeof enrollmentCountRaw === 'string') {
                        enrollmentCount = parseInt(enrollmentCountRaw, 10);
                    } else if (typeof enrollmentCountRaw === 'number') {
                        enrollmentCount = enrollmentCountRaw;
                    }
                    // Default to 0 if parsing fails or value is invalid
                    if (isNaN(enrollmentCount) || enrollmentCount < 0) {
                         console.warn(`Invalid enrollmentCount received for offering ID ${id}: ${enrollmentCountRaw}. Defaulting to 0.`);
                         enrollmentCount = 0;
                    }

                    // Calculate available seats safely
                    const availableSeats = Math.max(0, capacity - enrollmentCount);

                    // --- Return structured object ---
                    return {
                        id: id,
                        course: { id: courseId, course_name: courseName, credits: courseCredits },
                        faculty: { id: facultyId, name: facultyName },
                        capacity: capacity,
                        enrollmentCount: enrollmentCount, // Keep enrollmentCount
                        availableSeats: availableSeats,
                    };
                 }).filter(o => {
                     // Stricter filtering for valid items
                     const isValid = o.id != null &&
                                     o.course?.id !== '?' &&
                                     o.faculty?.id !== '?' &&
                                     typeof o.capacity === 'number' && o.capacity >= 0 &&
                                     typeof o.availableSeats === 'number' &&
                                     typeof o.enrollmentCount === 'number'; // Also check enrollmentCount
                     if (!isValid) {
                         console.warn("Filtering out invalid offering object:", o);
                     }
                     return isValid;
                 });

                 console.log("Validated Offerings:", validatedOfferings);

                 // Initial sort
                 validatedOfferings.sort((a, b) => (a.course.course_name || '').localeCompare(b.course.course_name || '') || (a.faculty.name || '').localeCompare(b.faculty.name || ''));

                 setAvailableOfferings(validatedOfferings);

             } else {
                 // Handle unexpected API response structure
                 console.error("Invalid API response structure:", response.data);
                 throw new Error(response.data?.message || "Received invalid data structure for offerings from the server.");
             }
         } catch (err) {
             // Use the centralized handler
             handleApiError(err, "fetching course offerings");
             setAvailableOfferings([]); // Clear state on critical fetch error
         } finally {
             setIsLoading(false); // Ensure loading indicator is always turned off
             console.log("Fetching finished.");
         }
    }, [getAuthHeaders, handleApiError]); // Dependencies for useCallback

    // Initial data fetch on component mount
    useEffect(() => {
        console.log("Component mounted, fetching initial offerings...");
        fetchOfferings();
    }, [fetchOfferings]); // fetchOfferings is now a stable dependency

    // --- Memoized Calculations ---

    // Map offerings by their ID for quick lookup
    const offeringMap = useMemo(() => {
        console.log("Recalculating offeringMap...");
        const map = new Map();
        availableOfferings.forEach(offering => map.set(offering.id, offering));
        return map;
     }, [availableOfferings]); // Dependency: availableOfferings

    // Recalculate total credits when selection or the map changes
    useEffect(() => {
        console.log("Recalculating total credits...");
        let currentTotal = 0;
        selectedOfferings.forEach(offeringId => {
            const offering = offeringMap.get(offeringId);
            const credits = offering?.course?.credits; // Safe access
            if (typeof credits === 'number' && !isNaN(credits)) {
                currentTotal += credits;
            }
        });
        setTotalCredits(currentTotal);
    }, [selectedOfferings, offeringMap]); // Dependencies: selectedOfferings, offeringMap

    // Check if enrollment constraints are met
    const constraintsMet = useMemo(() => {
        console.log("Checking constraints...");
        let fiveCreditCount = 0;
        let fourCreditCount = 0;
        selectedOfferings.forEach(offeringId => {
            const credits = offeringMap.get(offeringId)?.course?.credits; // Safe access
            if (credits === 5) fiveCreditCount++;
            if (credits === 4) fourCreditCount++;
        });
        const met = (fiveCreditCount >= 1 && fourCreditCount >= 2 && totalCredits === CREDIT_LIMIT);
        return met;
    }, [selectedOfferings, offeringMap, totalCredits]); // Dependencies: selectedOfferings, offeringMap, totalCredits

    // Filter and sort offerings for display
    const displayOfferings = useMemo(() => {
        console.log("Filtering/Sorting displayOfferings...");
        let filtered = [...availableOfferings]; // Create mutable copy

        // Filter by Credits
        if (filterCredits !== 'all') {
            const creditValue = parseInt(filterCredits, 10);
            if (!isNaN(creditValue)) {
                filtered = filtered.filter(o => o.course?.credits === creditValue);
            }
        }
        // Filter by Search Term
        if (searchTerm.trim() !== '') {
            const lowerSearchTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(o =>
                (o.course?.course_name || '').toLowerCase().includes(lowerSearchTerm) ||
                (o.course?.id || '').toLowerCase().includes(lowerSearchTerm) ||
                (o.faculty?.name || '').toLowerCase().includes(lowerSearchTerm) ||
                (o.availableSeats <= 0 && 'full'.includes(lowerSearchTerm)) ||
                (o.availableSeats > 0 && 'available'.includes(lowerSearchTerm))
            );
        }

        // Sorting (with safe access)
        switch (sortOption) {
            case 'faculty-name-asc': filtered.sort((a, b) => (a.faculty?.name ?? '').localeCompare(b.faculty?.name ?? '') || (a.course?.course_name ?? '').localeCompare(b.course?.course_name ?? '')); break;
            case 'credits-asc': filtered.sort((a, b) => (a.course?.credits ?? 0) - (b.course?.credits ?? 0) || (a.course?.course_name ?? '').localeCompare(b.course?.course_name ?? '')); break;
            case 'credits-desc': filtered.sort((a, b) => (b.course?.credits ?? 0) - (a.course?.credits ?? 0) || (a.course?.course_name ?? '').localeCompare(b.course?.course_name ?? '')); break;
            case 'seats-asc': filtered.sort((a, b) => (a.availableSeats ?? 0) - (b.availableSeats ?? 0) || (a.course?.course_name ?? '').localeCompare(b.course?.course_name ?? '')); break;
            case 'seats-desc': filtered.sort((a, b) => (b.availableSeats ?? 0) - (a.availableSeats ?? 0) || (a.course?.course_name ?? '').localeCompare(b.course?.course_name ?? '')); break;
            case 'course-name-asc': default: filtered.sort((a, b) => (a.course?.course_name ?? '').localeCompare(b.course?.course_name ?? '') || (a.faculty?.name ?? '').localeCompare(b.faculty?.name ?? '')); break;
        }
        return filtered;
     }, [availableOfferings, searchTerm, filterCredits, sortOption]); // Dependencies

    // Get unique credit values for the filter dropdown
    const uniqueCreditOptions = useMemo(() => {
        const credits = [...new Set(availableOfferings.map(o => o.course?.credits).filter(c => typeof c === 'number' && !isNaN(c)))]
            .sort((a, b) => a - b);
        return ['all', ...credits];
     }, [availableOfferings]); // Dependency: availableOfferings

    // --- Handlers ---

    // Toggle selection of a course offering
    const handleToggleSelect = (offeringId) => {
        console.log(`Toggling selection for offering ID: ${offeringId}`);
        if (error) setError(null); // Clear error on interaction

        const offering = offeringMap.get(offeringId);
        if (!offering || !offering.course) { // Robust check
             console.error(`Cannot toggle selection: Invalid offering data for ID: ${offeringId}`);
             alert("An error occurred. Could not find details for the selected course. Please refresh.");
             return;
        }

        const newSelected = new Set(selectedOfferings);
        const isSelected = newSelected.has(offeringId);
        const courseName = offering.course.course_name || 'this course';
        const courseCredits = offering.course.credits; // Should be number

        if (isSelected) {
            // Deselecting
            console.log(`Deselecting ${courseName} (ID: ${offeringId})`);
            newSelected.delete(offeringId);
        } else {
            // Selecting: Perform checks
            console.log(`Attempting to select ${courseName} (ID: ${offeringId})`);

            // 1. Check Available Seats
            if (offering.availableSeats <= 0) {
                console.warn(`Selection prevented: ${courseName} is full.`);
                alert(`Cannot select "${courseName}". This offering is full (${offering.enrollmentCount}/${offering.capacity}).`);
                return;
            }

            // 2. Check Credit Limit
            const currentCreditsNumber = Number(totalCredits);
            const courseCreditsNumber = Number(courseCredits);
            if (isNaN(courseCreditsNumber) || courseCreditsNumber <= 0) {
                 console.error(`Selection prevented: Invalid credit data (${courseCredits}) for ${courseName}.`);
                 alert(`Cannot select "${courseName}" due to invalid credit data. Please contact support.`);
                 return;
            }
            if (currentCreditsNumber + courseCreditsNumber > CREDIT_LIMIT) {
                console.warn(`Selection prevented: Exceeds credit limit.`);
                alert(`Cannot select "${courseName}". Adding it (${courseCreditsNumber} credits) would exceed the limit of ${CREDIT_LIMIT}. Current total: ${currentCreditsNumber}.`);
                return;
            }

            // 3. Add to selection if checks pass
            console.log(`Selected ${courseName} successfully.`);
            newSelected.add(offeringId);
        }
        setSelectedOfferings(newSelected); // Update state
    };

    // Submit the selected enrollments
    const handleSubmitEnrollment = async () => {
        console.log("Attempting to submit enrollment...");
        setError(null); // Clear previous submission errors

        // --- Pre-Submission Client-Side Checks ---
        if (selectedOfferings.size === 0) { alert("Please select at least one course offering to enroll."); return; }
        if (totalCredits > CREDIT_LIMIT) { alert(`Your total selected credits (${totalCredits}) exceed the limit of ${CREDIT_LIMIT}. Please deselect offerings.`); return; }
        if (!constraintsMet) {
             const message = totalCredits !== CREDIT_LIMIT
                 ? `Requirement: Exactly ${CREDIT_LIMIT} credits needed (Selected: ${totalCredits}).`
                 : `Requirement: At least one 5-credit and two 4-credit courses needed.`;
             alert(message); return;
        }
        // Optional: Re-verify available seats just before submitting
        let hasFullCourse = false;
        let fullCourseName = '';
        for (const id of selectedOfferings) {
            const offering = offeringMap.get(id);
            if (offering && offering.availableSeats <= 0) {
                hasFullCourse = true;
                fullCourseName = offering.course?.course_name || `ID ${id}`;
                break;
            }
        }
        if (hasFullCourse) {
            alert(`Cannot submit enrollment: "${fullCourseName}" is now full. Please deselect it and try again.`);
            fetchOfferings(); // Refresh data to show updated status
            return;
        }
        // --- End Client-Side Checks ---

        // --- Prepare and Send API Request ---
        const enrollmentPayload = { facultyCourseIds: Array.from(selectedOfferings) };
        const headers = getAuthHeaders();
        if (!headers) return; // Error handled by getAuthHeaders

        setIsLoading(true); // Indicate submission in progress

        try {
            console.log("Submitting payload:", enrollmentPayload);
            const response = await axios.post(`${BASE_URL}/enrollments`, enrollmentPayload, { headers });
            console.log("Enrollment submission response:", response);

            if (response.data && response.data.success === true) {
                alert(response.data.message || `Enrollment successful!`);
                setSelectedOfferings(new Set()); // Clear selection on success
                console.log("Enrollment successful, clearing selection and refetching offerings.");
                fetchOfferings(); // Refresh data to update seat counts
            } else {
                throw new Error(response.data?.message || "Enrollment submission failed on the server.");
            }
        } catch (err) {
            handleApiError(err, "submitting enrollment");
            // Refresh data if error was specifically due to capacity issue
            if (err.response?.data?.message?.toLowerCase().includes('full')) {
                 console.log("Enrollment failed due to capacity issue, refetching offerings.");
                 fetchOfferings();
            }
        } finally {
            setIsLoading(false); // Stop loading indicator
            console.log("Enrollment submission process finished.");
        }
    };


    // --- Render Logic ---

    // 1. Initial Loading State
    if (isLoading && availableOfferings.length === 0) {
         return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div></div>;
    }

    // 2. Critical Error State (failed initial load)
    if (error && availableOfferings.length === 0 && !isLoading) {
         return (
            <div className="container mx-auto p-4 md:p-6 max-w-3xl text-center">
                 <div className="p-6 bg-red-100 text-red-700 rounded-lg shadow border border-red-300">
                     <h3 className="text-xl font-semibold mb-3">Error Loading Offerings</h3>
                     <p>{error}</p>
                     <button onClick={fetchOfferings} className="mt-4 mr-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50" disabled={isLoading}>
                         {isLoading ? 'Retrying...' : 'Retry'}
                     </button>
                 </div>
            </div>);
     }

    // 3. Main Content Render
    return (
        <div className="container mx-auto p-4 md:p-6 max-w-7xl">
            <h3 className="text-3xl font-bold text-center mb-8 text-gray-800">Course Enrollment</h3>

            {/* Display Non-Critical Errors (e.g., submission errors) */}
            {error && (
                 <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-300 text-sm shadow" role="alert">
                     <strong>Error:</strong> {error}
                     <button onClick={() => setError(null)} className="float-right font-bold text-red-600 hover:text-red-800 px-2 text-lg leading-none" aria-label="Dismiss error">×</button>
                 </div>
             )}

            {/* --- Student Status Bar --- */}
             <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl shadow-lg mb-8 border border-gray-200 sticky top-4 z-10">
                 <div className="flex justify-between items-center mb-3 border-b pb-3">
                     <span className="font-semibold text-sm text-gray-700">Selected Credits:</span>
                     <span className={`font-bold text-xl ${totalCredits > CREDIT_LIMIT ? 'text-red-600 animate-pulse' : 'text-green-600'}`}>{totalCredits} / {CREDIT_LIMIT}</span>
                 </div>
                 <div className="w-full bg-gray-300 rounded-full h-2.5 mb-1" title={`Credit Progress: ${totalCredits}/${CREDIT_LIMIT}`}>
                     <div className={`h-full rounded-full transition-all duration-300 ease-out ${totalCredits > CREDIT_LIMIT ? 'bg-red-500' : 'bg-gradient-to-r from-blue-400 to-indigo-600'}`} style={{ width: `${Math.min((totalCredits / CREDIT_LIMIT) * 100, 100)}%` }} role="progressbar" aria-valuenow={totalCredits} aria-valuemin="0" aria-valuemax={CREDIT_LIMIT}></div>
                 </div>
                  {totalCredits > CREDIT_LIMIT && ( <p className="text-red-600 text-xs mt-1 text-center font-medium animate-pulse">Warning: Credit limit exceeded!</p> )}
              </div>

            {/* --- Filter/Sort/Search Controls --- */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6 border flex flex-col md:flex-row gap-4 items-center">
                 <div className="relative flex-grow w-full md:w-auto"> <input type="text" placeholder="Search Course Name/ID, Faculty..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-transparent outline-none text-sm shadow-sm" aria-label="Search available course offerings" /> </div>
                 <div className="relative w-full md:w-auto"> <select value={filterCredits} onChange={e => setFilterCredits(e.target.value)} className="w-full appearance-none px-4 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-transparent outline-none text-sm bg-white shadow-sm cursor-pointer" aria-label="Filter offerings by credit value"> <option value="all">Filter Credits (All)</option> {uniqueCreditOptions.filter(c=>c !== 'all').map(credit => (<option key={credit} value={credit}>{`${credit} Credit${credit > 1 ? 's' : ''}`}</option> ))} </select> <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">▼</span> </div>
                 <div className="relative w-full md:w-auto"> <select value={sortOption} onChange={e => setSortOption(e.target.value)} className="w-full appearance-none px-4 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-transparent outline-none text-sm bg-white shadow-sm cursor-pointer" aria-label="Sort offerings"> <option value="course-name-asc">Sort: Course (A-Z)</option> <option value="faculty-name-asc">Sort: Faculty (A-Z)</option> <option value="credits-asc">Sort: Credits (Low-High)</option> <option value="credits-desc">Sort: Credits (High-Low)</option> <option value="seats-asc">Sort: Seats (Low-High)</option> <option value="seats-desc">Sort: Seats (High-Low)</option> </select> <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">▼</span> </div>
            </div>

            {/* --- Available Offerings List --- */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border min-h-[300px]">
                 <h4 className="text-xl font-semibold mb-5 text-gray-700 border-b pb-2 flex justify-between items-center">
                    <span>Available Offerings ({displayOfferings.length})</span>
                    {isLoading && availableOfferings.length > 0 && <span className="text-sm text-gray-500 italic">Updating...</span>}
                 </h4>

                 {/* Conditional Rendering: List or Empty State */}
                 {displayOfferings.length > 0 ? (
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                         {/* Map over filtered/sorted offerings */}
                         {displayOfferings.map((offering) => {
                             // Destructure ALL needed properties safely
                             const { id: offeringId, course, faculty, capacity = 0, availableSeats = 0, enrollmentCount = 0 } = offering;
                             const credits = course?.credits ?? 0;
                             const courseName = course?.course_name ?? 'Unknown Course';
                             const courseCode = course?.id ?? '?';
                             const facultyName = faculty?.name ?? 'Unknown Faculty';
                             const isSelected = selectedOfferings.has(offeringId);

                             // Calculate if selection button should be disabled
                             let isSelectDisabled = false;
                             let selectDisabledReason = '';
                             const currentTotalNum = Number(totalCredits);
                             const courseCreditsNum = Number(credits);

                             if (availableSeats <= 0 && !isSelected) { isSelectDisabled = true; selectDisabledReason = 'This offering is full.'; }
                             else if (isNaN(courseCreditsNum) || courseCreditsNum <= 0) { isSelectDisabled = true; selectDisabledReason = 'Invalid credit data.'; }
                             else if (currentTotalNum + courseCreditsNum > CREDIT_LIMIT && !isSelected) { isSelectDisabled = true; selectDisabledReason = `Exceeds credit limit (${CREDIT_LIMIT}).`; }

                             // Dynamic classes for styling based on state
                             const cardClasses = ['flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg transition-all duration-150 ease-in-out shadow-sm hover:shadow-md', isSelected ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-200' : 'bg-white border-gray-200', isSelectDisabled && !isSelected ? 'opacity-60 cursor-not-allowed' : '', !isSelected && availableSeats > 0 && availableSeats <= 5 ? 'border-orange-300 bg-orange-50' : '', availableSeats <= 0 && !isSelected ? 'bg-gray-100 border-gray-300' : '', ].filter(Boolean).join(' ');
                             const buttonClasses = ['flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap transition-colors duration-150', isSelected ? 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200 focus:ring-1 focus:ring-red-300 focus:outline-none' : (isSelectDisabled ? 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed' : 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200 focus:ring-1 focus:ring-green-300 focus:outline-none') ].filter(Boolean).join(' ');
                             const buttonText = isSelected ? 'Deselect' : (availableSeats <= 0 ? 'Full' : 'Select');

                             // Render the Offering Card
                             return (
                                 <div key={offeringId} title={isSelectDisabled && !isSelected ? selectDisabledReason : `Seats: ${availableSeats}/${capacity} | Credits: ${credits}`} className={cardClasses} role="listitem" aria-labelledby={`course-name-${offeringId}`} aria-describedby={`course-details-${offeringId}`}>
                                     {/* Left side: Course Details */}
                                     <div className="flex-grow mr-4 mb-2 sm:mb-0" id={`course-details-${offeringId}`}>
                                         <p id={`course-name-${offeringId}`} className="font-semibold text-base text-gray-800">{courseName} <span className="text-sm font-normal text-gray-600">({courseCode})</span></p>
                                         <p className="text-sm text-gray-500"><span className="font-medium">Faculty:</span> {facultyName} | <span className="font-medium">Credits:</span> {credits}</p>
                                         {/* Display Seat Information */}
                                         <p className={`text-sm font-medium ${availableSeats <= 0 ? 'text-red-600' : (availableSeats <= 5 ? 'text-orange-600' : 'text-green-700')}`}>
                                             <span className="font-semibold">Seats:</span> {enrollmentCount} Enrolled / {capacity} Capacity
                                             <span className="ml-2">({availableSeats} Available)</span>
                                             {availableSeats <= 0 && <span className="font-bold ml-1 text-red-700">(Full)</span>}
                                         </p>
                                         {/* Display reason if disabled */}
                                         {isSelectDisabled && !isSelected && (<p className="text-xs text-red-500 mt-1">{selectDisabledReason}</p>)}
                                     </div>
                                     {/* Right side: Action Button */}
                                     <button onClick={() => handleToggleSelect(offeringId)} disabled={(isSelectDisabled && !isSelected) || isLoading} className={buttonClasses} aria-label={`${buttonText} ${courseName}`}>{buttonText}</button>
                                 </div>
                             );
                         })}
                     </div>
                 ) : (
                    // Empty state shown only if not loading and no results match filters
                    !isLoading && displayOfferings.length === 0 && (
                         <div className="text-center py-16 text-gray-500">
                             <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
                             <h3 className="mt-2 text-sm font-medium text-gray-900">No Course Offerings Found</h3>
                             <p className="mt-1 text-sm text-gray-500">{searchTerm === '' && filterCredits === 'all' ? "There are currently no course offerings available for enrollment." : "No offerings match your current filter or search criteria."}</p>
                         </div>
                    )
                 )}
             </div> {/* End Offerings List Container */}


            {/* --- Submit Button and Warnings --- */}
             <div className="mt-10 text-center">
                 <button onClick={handleSubmitEnrollment} disabled={isLoading || selectedOfferings.size === 0 || !constraintsMet} className="bg-green-600 text-white font-bold px-10 py-3 rounded-lg shadow-lg hover:bg-green-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600 transform hover:scale-105 disabled:transform-none" aria-live="polite">
                     {isLoading ? 'Processing...' : `Submit Enrollment (${selectedOfferings.size} ${selectedOfferings.size === 1 ? 'Offering' : 'Offerings'})`}
                 </button>
                 {/* Warnings shown only when relevant */}
                 {!isLoading && selectedOfferings.size > 0 && !constraintsMet && ( <p className="text-red-600 text-sm mt-3 font-medium">{totalCredits !== CREDIT_LIMIT ? `Requirement: Exactly ${CREDIT_LIMIT} credits needed (Selected: ${totalCredits}).` : `Requirement: At least one 5-credit and two 4-credit courses needed.`}</p> )}
                 {!isLoading && selectedOfferings.size === 0 && ( <p className="text-gray-500 text-sm mt-3">Please select courses to enroll.</p> )}
            </div> {/* End Submit Button Container */}

        </div> // End Main Container
    ); // End Return
} // End Component

export default StudentEnrollment;