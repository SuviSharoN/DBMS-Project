// Frontend/src/Pages/Enrollment/StudentEnrollment.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- Constants ---
const CREDIT_LIMIT = 22;
// REMOVED constraint-specific constants:
// const TARGET_CREDIT_COUNTS = { 5: 1, 4: 2, 3: 3 };
// const REQUIRED_CREDIT_VALUES = Object.keys(TARGET_CREDIT_COUNTS).map(Number);
const BASE_URL = 'http://localhost:5000/api';

function StudentEnrollment() {
    // State specific to student enrollment
    const [availableOfferings, setAvailableOfferings] = useState([]);
    const [selectedOfferings, setSelectedOfferings] = useState(new Set()); // Stores facultyCourse IDs
    const [totalCredits, setTotalCredits] = useState(0);
    // REMOVED selectedCreditCounts state:
    // const [selectedCreditCounts, setSelectedCreditCounts] = useState(/* ... */);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCredits, setFilterCredits] = useState('all');
    const [sortOption, setSortOption] = useState('course-name-asc');
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
                localStorage.clear(); // Clear local storage on auth errors
                navigate('/login', { state: { message: "Authentication/Authorization error. Please log in again." }, replace: true });
            }
        } else if (err.request) message = "Network Error: Could not reach server.";
        setError(message);
        // Only alert for critical errors, maybe not for fetches? Or use a toast notification library.
        // alert(message);
     };

    // --- Data Fetching ---
    const fetchOfferings = async () => {
         setIsLoading(true);
         setError(null);
         const headers = getAuthHeaders();
         if (!headers) { setIsLoading(false); return; }

         try {
             const response = await axios.get(`${BASE_URL}/offerings`, { headers });
             if (response.data.success) {
                 const offeringsData = Array.isArray(response.data.data) ? response.data.data : [];
                 const validatedOfferings = offeringsData.map(o => ({
                     id: o.id,
                     course: o.course || { id: '?', course_name: '?', credits: 0 },
                     faculty: o.faculty || { id: '?', name: '?' },
                 })).filter(o => o.id != null && o.course.id !== '?');

                 validatedOfferings.sort((a, b) => (a.course.course_name || '').localeCompare(b.course.course_name || '') || (a.faculty.name || '').localeCompare(b.faculty.name || ''));
                 setAvailableOfferings(validatedOfferings);
             } else { throw new Error(response.data.message || "Failed to fetch offerings."); }
         } catch (err) {
             handleApiError(err, "fetching course offerings");
             setAvailableOfferings([]); // Clear data on error
         } finally {
             setIsLoading(false);
         }
    };

    useEffect(() => {
        fetchOfferings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Fetch only once on mount

    // --- Memoized Calculations ---
    // Map offerings by their ID for quick lookup
    const offeringMap = useMemo(() => {
        const map = new Map();
        availableOfferings.forEach(offering => map.set(offering.id, offering));
        return map;
     }, [availableOfferings]);

    // Recalculate total credits when selection changes
    useEffect(() => {
        let currentTotal = 0;
        selectedOfferings.forEach(offeringId => {
            const offering = offeringMap.get(offeringId);
            // Add credits only if offering and course credits are valid numbers
            if (offering?.course && typeof offering.course.credits === 'number' && !isNaN(offering.course.credits)) {
                currentTotal += offering.course.credits;
            }
        });
        setTotalCredits(currentTotal);
    }, [selectedOfferings, offeringMap]);

    // REMOVED constraintsMet calculation

    // Filter and sort offerings for display
    const displayOfferings = useMemo(() => {
        let filtered = [...availableOfferings];
        // Filter by Credits
        if (filterCredits !== 'all') {
            const creditValue = parseInt(filterCredits, 10);
            if (!isNaN(creditValue)) {
                filtered = filtered.filter(offering => offering.course?.credits === creditValue);
            }
        }
        // Filter by Search Term
        if (searchTerm.trim() !== '') {
            const lowerSearchTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(offering =>
                (offering.course?.course_name || '').toLowerCase().includes(lowerSearchTerm) ||
                (offering.course?.id || '').toLowerCase().includes(lowerSearchTerm) ||
                (offering.faculty?.name || '').toLowerCase().includes(lowerSearchTerm)
            );
        }
        // Sort
        switch (sortOption) {
            // Add cases for sorting as needed
            case 'faculty-name-asc':
                 filtered.sort((a, b) => (a.faculty?.name || '').localeCompare(b.faculty?.name || '') || (a.course?.course_name || '').localeCompare(b.course?.course_name || ''));
                 break;
            case 'credits-asc':
                filtered.sort((a, b) => (a.course?.credits || 0) - (b.course?.credits || 0) || (a.course?.course_name || '').localeCompare(b.course?.course_name || ''));
                break;
            case 'credits-desc':
                filtered.sort((a, b) => (b.course?.credits || 0) - (a.course?.credits || 0) || (a.course?.course_name || '').localeCompare(b.course?.course_name || ''));
                break;
            case 'course-name-asc':
            default:
                 filtered.sort((a, b) => (a.course?.course_name || '').localeCompare(b.course?.course_name || '') || (a.faculty?.name || '').localeCompare(b.faculty?.name || ''));
                 break;
        }
        return filtered;
     }, [availableOfferings, searchTerm, filterCredits, sortOption]);

    // Get unique credit values for the filter dropdown
    const uniqueCreditOptions = useMemo(() => {
        const credits = [...new Set(availableOfferings.map(o => o.course?.credits).filter(c => typeof c === 'number' && !isNaN(c)))].sort((a, b) => a - b);
        return ['all', ...credits];
     }, [availableOfferings]);

    // --- Handlers ---
    const handleToggleSelect = (offeringId) => {
        const offering = offeringMap.get(offeringId);
        if (!offering?.course) {
             console.error("Cannot toggle selection: Offering or course data missing.");
             return;
        }

        const newSelected = new Set(selectedOfferings);
        const isSelected = newSelected.has(offeringId);

        if (isSelected) {
            newSelected.delete(offeringId);
        } else {
            // Check only the overall credit limit
            const currentCreditsNumber = Number(totalCredits);
            const courseCreditsNumber = Number(offering.course.credits);

            // Basic validation
            if (isNaN(currentCreditsNumber) || isNaN(courseCreditsNumber) || courseCreditsNumber <= 0) {
                 alert("Cannot select offering due to invalid credit data.");
                 return;
            }
            // Check limit
            if (currentCreditsNumber + courseCreditsNumber > CREDIT_LIMIT) {
                alert(`Cannot select "${offering.course.course_name}". Adding it (${courseCreditsNumber} credits) would exceed the credit limit of ${CREDIT_LIMIT}. Current total: ${currentCreditsNumber}.`);
                return;
            }
            // REMOVED specific TARGET_CREDIT_COUNTS check

            // Add to selection if checks pass
            newSelected.add(offeringId);
        }
        setSelectedOfferings(newSelected);
    };

    const handleSubmitEnrollment = async () => {
        if (selectedOfferings.size === 0) { alert("Please select at least one course offering to enroll."); return; }
        if (totalCredits > CREDIT_LIMIT) { alert("Your total selected credits exceed the limit. Please deselect one or more offerings."); return; }
        // REMOVED constraintsMet check

        const enrollmentPayload = { facultyCourseIds: Array.from(selectedOfferings) };
        const headers = getAuthHeaders();
        if (!headers) return; // Shouldn't happen if user is on page, but good check

        setIsLoading(true); // Indicate submission in progress
        setError(null);

        try {
            const response = await axios.post(`${BASE_URL}/enrollments`, enrollmentPayload, { headers });
            if (response.data.success) {
                alert(response.data.message || `Enrollment successful!`);
                setSelectedOfferings(new Set()); // Clear selection on success
                // Optionally refetch offerings if needed (e.g., if seats were displayed/used)
                // fetchOfferings();
            } else {
                // Use backend message if provided
                throw new Error(response.data.message || "Enrollment submission failed on the server.");
            }
        } catch (err) {
            // Use the centralized error handler
            handleApiError(err, "submitting enrollment");
        } finally {
            setIsLoading(false);
        }
    };

    // --- Render ---
    if (isLoading && availableOfferings.length === 0) { // Show initial loading
         return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div></div>;
    }

    // Show critical error if loading failed and no data is available
    if (error && availableOfferings.length === 0) {
         return (
            <div className="container mx-auto p-4 md:p-6 max-w-3xl text-center">
                 <div className="p-6 bg-red-100 text-red-700 rounded-lg shadow border border-red-300">
                     <h3 className="text-xl font-semibold mb-3">Error Loading Offerings</h3>
                     <p>{error}</p>
                     <button
                         onClick={fetchOfferings} // Retry button
                         className="mt-4 mr-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                     >
                         Retry
                     </button>
                 </div>
            </div>
        );
     }


    return (
        <div className="container mx-auto p-4 md:p-6 max-w-7xl">
            <h3 className="text-3xl font-bold text-center mb-8 text-gray-800">
                Course Enrollment
            </h3>
            {/* Display non-critical errors (e.g., from enrollment submission) */}
            {error && (
                 <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-300 text-sm" role="alert">
                     <strong>Error:</strong> {error}
                     <button onClick={() => setError(null)} className="float-right font-bold text-red-500 hover:text-red-800 px-2" aria-label="Dismiss error">×</button>
                 </div>
             )}

            {/* --- Student Status Bar --- */}
             <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl shadow-lg mb-8 border border-gray-200 sticky top-4 z-10">
                 <div className="flex justify-between items-center mb-3 border-b pb-3">
                     <span className="font-semibold text-sm">Selected Credits:</span>
                     <span className={`font-bold text-xl ${totalCredits > CREDIT_LIMIT ? 'text-red-600 animate-pulse' : 'text-green-600'}`}>
                         {totalCredits} / {CREDIT_LIMIT}
                     </span>
                 </div>
                 <div className="w-full bg-gray-300 rounded-full h-2.5 mb-1" title={`Credit Progress: ${totalCredits}/${CREDIT_LIMIT}`}>
                     <div className={`h-full rounded-full transition-all duration-300 ease-out ${totalCredits > CREDIT_LIMIT ? 'bg-red-500' : 'bg-gradient-to-r from-blue-400 to-indigo-600'}`}
                         style={{ width: `${Math.min((totalCredits / CREDIT_LIMIT) * 100, 100)}%` }}
                         role="progressbar" aria-valuenow={totalCredits} aria-valuemin="0" aria-valuemax={CREDIT_LIMIT}>
                    </div>
                 </div>
                  {totalCredits > CREDIT_LIMIT && ( <p className="text-red-600 text-xs mt-1 text-center font-medium animate-pulse">Warning: Credit limit exceeded!</p> )}
              </div>

            {/* --- Filter/Sort/Search Controls --- */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6 border flex flex-col md:flex-row gap-4 items-center">
                 <div className="relative flex-grow w-full md:w-auto">
                     <input
                        type="text"
                        placeholder="Search Course Name/ID, Faculty..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-transparent outline-none text-sm shadow-sm"
                        aria-label="Search available course offerings"
                    />
                 </div>
                 <div className="relative w-full md:w-auto">
                      <select
                        value={filterCredits}
                        onChange={e => setFilterCredits(e.target.value)}
                        className="w-full appearance-none px-4 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-transparent outline-none text-sm bg-white shadow-sm cursor-pointer"
                        aria-label="Filter offerings by credit value"
                       >
                           <option value="all">Filter Credits (All)</option>
                           {uniqueCreditOptions.filter(c=>c !== 'all').map(credit => (
                               <option key={credit} value={credit}>
                                   {`${credit} Credit${credit > 1 ? 's' : ''}`}
                               </option>
                           ))}
                      </select>
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">▼</span>
                  </div>
                  <div className="relative w-full md:w-auto">
                      <select
                        value={sortOption}
                        onChange={e => setSortOption(e.target.value)}
                        className="w-full appearance-none px-4 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-transparent outline-none text-sm bg-white shadow-sm cursor-pointer"
                        aria-label="Sort offerings"
                       >
                           <option value="course-name-asc">Sort: Course (A-Z)</option>
                           <option value="faculty-name-asc">Sort: Faculty (A-Z)</option>
                           <option value="credits-asc">Sort: Credits (Low-High)</option>
                           <option value="credits-desc">Sort: Credits (High-Low)</option>
                      </select>
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">▼</span>
                  </div>
              </div>

            {/* --- Available Offerings List --- */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border min-h-[300px]">
                 <h4 className="text-xl font-semibold mb-5 text-gray-700 border-b pb-2"> Available Offerings ({displayOfferings.length}) </h4>
                 {isLoading && <div className="text-center text-gray-500 py-4">Updating...</div>}
                 {!isLoading && displayOfferings.length > 0 ? (
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                         {displayOfferings.map((offering) => {
                             const { id: offeringId, course, faculty } = offering;
                             const isSelected = selectedOfferings.has(offeringId);
                             const credits = course?.credits ?? '?';

                             let isSelectDisabled = false;
                             let selectDisabledReason = '';
                             const currentTotalNum = Number(totalCredits);
                             const courseCreditsNum = Number(credits);
                             if (isNaN(currentTotalNum) || isNaN(courseCreditsNum) || courseCreditsNum <= 0) {
                                 isSelectDisabled = true;
                                 selectDisabledReason = 'Invalid credit data.';
                             } else if (currentTotalNum + courseCreditsNum > CREDIT_LIMIT && !isSelected) { // Check only if not already selected
                                 isSelectDisabled = true;
                                 selectDisabledReason = `Exceeds credit limit (${CREDIT_LIMIT}).`;
                             }
                              // Add specific credit count check here if it were still needed

                             return (
                                 <div key={offeringId} title={isSelectDisabled && !isSelected ? selectDisabledReason : ''}
                                      className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg transition-all duration-150 ease-in-out shadow-sm hover:shadow-md ${isSelected ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-200' : 'bg-white'} ${isSelectDisabled && !isSelected ? 'opacity-65 cursor-not-allowed' : ''}`}>
                                     <div className="flex-grow mr-4 mb-2 sm:mb-0">
                                         <p className="font-semibold text-base text-gray-800">{course?.course_name || 'Unknown'} <span className="text-sm font-normal text-gray-600">({course?.id || '?'})</span></p>
                                         <p className="text-sm text-gray-500">
                                             <span className="font-medium">Faculty:</span> {faculty?.name || '?'} | <span className="font-medium">Credits:</span> {credits}
                                         </p>
                                         {isSelectDisabled && !isSelected && <p className="text-xs text-red-500 mt-1">{selectDisabledReason}</p>}
                                     </div>
                                     <button
                                         onClick={() => handleToggleSelect(offeringId)}
                                         disabled={isSelectDisabled && !isSelected} // Disable only if cannot be selected
                                         className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap transition-colors duration-150 ${ isSelected ? 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200' : (isSelectDisabled ? 'bg-gray-200 text-gray-500 border-gray-300' : 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200')}`} >
                                         {isSelected ? 'Deselect' : 'Select'}
                                     </button>
                                 </div>
                             );
                         })}
                     </div>
                 ) : (
                     !isLoading && // Only show "No offerings" if not loading
                     <div className="text-center py-16 text-gray-500">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No Course Offerings Found</h3>
                          <p className="mt-1 text-sm text-gray-500">
                              {searchTerm === '' && filterCredits === 'all' ? "There are currently no course offerings available for enrollment." : "No offerings match your current filter or search criteria."}
                          </p>
                     </div>
                 )}
             </div>

            {/* --- Submit Button --- */}
             <div className="mt-10 text-center">
                 <button onClick={handleSubmitEnrollment}
                         disabled={isLoading || selectedOfferings.size === 0 || totalCredits > CREDIT_LIMIT}
                         className="bg-green-600 text-white font-bold px-10 py-3 rounded-lg shadow-lg hover:bg-green-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600 transform hover:scale-105 disabled:transform-none">
                      {isLoading ? 'Submitting...' : `Submit Enrollment (${selectedOfferings.size} ${selectedOfferings.size === 1 ? 'Offering' : 'Offerings'})`}
                 </button>
                  {/* Warnings */}
                  {totalCredits > CREDIT_LIMIT && (
                       <p className="text-red-600 text-sm mt-3 font-medium">Error: Total credits exceed the limit ({CREDIT_LIMIT}).</p>
                  )}
                  {/* Removed constraint warning */}
              </div>
        </div>
    );
}

export default StudentEnrollment;