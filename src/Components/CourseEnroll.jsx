// src/Components/CourseEnroll.jsx
import React, { useState, useEffect, useMemo } from 'react';
// --- REMOVED: react-icons import ---
// import { FaSearch, FaSortAmountDown, FaSortAmountUp, FaFilter, FaPlus, FaTimes } from 'react-icons/fa';

// --- Mock Data ---
const MOCK_COURSES = [
  { id: 'CS301', name: 'Advanced Algorithms', credits: 4 },
  { id: 'CS574', name: 'Deep Learning', credits: 5},
  { id: 'CS305', name: 'Operating Systems II', credits: 3 },
  { id: 'MA410', name: 'Linear Algebra', credits: 3 },
  { id: 'CS420', name: 'Machine Learning Fundamentals', credits: 4 },
  { id: 'CS451', name: 'Compiler Design', credits: 3 },
  { id: 'EE300', name: 'Digital Signal Processing', credits: 3 },
  { id: 'PH501', name: 'Quantum Physics', credits: 5 },
  { id: 'HU201', name: 'Technical Communication', credits: 2 },
  { id: 'CS500', name: 'Database Systems Internals', credits: 4 },
  { id: 'CS515', name: 'Network Security', credits: 3 },
  { id: 'CS530', name: 'Cloud Computing', credits: 3 },
  { id: 'GE101', name: 'Introductory Geology', credits: 1 },
  { id: 'PE200', name: 'Physical Education', credits: 1 },
];

const CREDIT_LIMIT = 25;
const TARGET_CREDIT_COUNTS = { 5: 1, 4: 2, 3: 3 };
const REQUIRED_CREDIT_VALUES = Object.keys(TARGET_CREDIT_COUNTS).map(Number);

// --- Component ---
function CourseEnroll() {
  // State Variables
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState(new Set());
  const [totalCredits, setTotalCredits] = useState(0);
  const [selectedCreditCounts, setSelectedCreditCounts] = useState({ 5: 0, 4: 0, 3: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCredits, setFilterCredits] = useState('all');
  const [sortOption, setSortOption] = useState('name-asc');

  // --- Fetch Data ---
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const sortedInitial = [...MOCK_COURSES].sort((a, b) => a.name.localeCompare(b.name));
        setAvailableCourses(sortedInitial);
        setError(null);
      } catch (err) {
        console.error("Failed to load courses:", err);
        setError("Failed to load courses. Please try again later.");
        setAvailableCourses([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // --- Memoized Course Map ---
  const courseMap = useMemo(() => {
    const map = new Map();
    availableCourses.forEach(course => map.set(course.id, course));
    return map;
  }, [availableCourses]);

  // --- Recalculate Totals & Counts ---
  useEffect(() => {
    let currentTotal = 0;
    const counts = { 5: 0, 4: 0, 3: 0 };
    selectedCourses.forEach(courseId => {
      const course = courseMap.get(courseId);
      if (course) {
        currentTotal += course.credits;
        if (TARGET_CREDIT_COUNTS.hasOwnProperty(course.credits)) {
          counts[course.credits]++;
        }
      }
    });
    setTotalCredits(currentTotal);
    setSelectedCreditCounts(counts);
  }, [selectedCourses, courseMap]);

  // --- Check Constraints ---
  const constraintsMet = useMemo(() => {
    return REQUIRED_CREDIT_VALUES.every(
      creditValue => selectedCreditCounts[creditValue] === TARGET_CREDIT_COUNTS[creditValue]
    );
  }, [selectedCreditCounts]);

  // --- Derive Displayed Courses ---
  const displayCourses = useMemo(() => {
    let filtered = [...availableCourses];
    if (filterCredits !== 'all') {
      const creditValue = parseInt(filterCredits, 10);
      filtered = filtered.filter(course => course.credits === creditValue);
    }
    if (searchTerm.trim() !== '') {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(course =>
        course.name.toLowerCase().includes(lowerSearchTerm) ||
        course.id.toLowerCase().includes(lowerSearchTerm)
      );
    }
    switch (sortOption) {
      case 'credits-asc': filtered.sort((a, b) => a.credits - b.credits || a.name.localeCompare(b.name)); break;
      case 'credits-desc': filtered.sort((a, b) => b.credits - a.credits || a.name.localeCompare(b.name)); break;
      case 'name-asc': default: filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return filtered;
  }, [availableCourses, searchTerm, filterCredits, sortOption]);

  // --- Get Unique Credit Options ---
  const uniqueCreditOptions = useMemo(() => {
    const credits = [...new Set(availableCourses.map(c => c.credits))].sort((a, b) => a - b);
    return ['all', ...credits];
  }, [availableCourses]);

  // --- Event Handlers ---
  const handleToggleSelect = (courseId) => {
    const course = courseMap.get(courseId);
    if (!course) return;
    const isSelected = selectedCourses.has(courseId);
    const newSelectedCourses = new Set(selectedCourses);

    if (isSelected) {
      newSelectedCourses.delete(courseId);
      setSelectedCourses(newSelectedCourses);
    } else {
      const potentialTotalCredits = totalCredits + course.credits;
      if (potentialTotalCredits > CREDIT_LIMIT) {
        alert(`Cannot select "${course.name}". Exceeds credit limit (${CREDIT_LIMIT}).`); return;
      }
      if (TARGET_CREDIT_COUNTS.hasOwnProperty(course.credits)) {
        if (selectedCreditCounts[course.credits] >= TARGET_CREDIT_COUNTS[course.credits]) {
          alert(`Cannot select another ${course.credits}-credit course. Limit reached.`); return;
        }
      }
      newSelectedCourses.add(courseId);
      setSelectedCourses(newSelectedCourses);
    }
  };

  const handleSubmitEnrollment = () => {
    if (!constraintsMet) { alert("Please meet all specific credit requirements."); return; }
    if (totalCredits > CREDIT_LIMIT) { alert("Total credits exceed the limit."); return; }
    if (selectedCourses.size === 0) { alert("Please select at least one course."); return; }
    console.log("Submitting enrollment:", Array.from(selectedCourses), totalCredits, selectedCreditCounts);
    alert(`Enrollment submitted for ${selectedCourses.size} courses (${totalCredits} credits).`);
  };

  const getConstraintStatusColor = (count, target) => {
    if (count === target) return 'text-green-600';
    if (count > target) return 'text-red-600';
    return 'text-orange-600';
  };

  // --- Render Logic ---
  if (isLoading) return <div className="flex justify-center items-center h-40"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;
  if (error) return <div className="text-center p-10 text-red-600 bg-red-100 rounded-lg">{error}</div>;

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
      <h3 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800 tracking-tight">
        Course Enrollment Portal
      </h3>

      {/* Status Bar Section */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl shadow-lg mb-8 sticky top-[72px] md:top-[88px] z-20 border border-gray-200">
        <div className="flex justify-between items-center mb-3 border-b border-gray-300 pb-3">
          <span className="font-semibold text-gray-700 text-sm md:text-base">Selected Credits:</span>
          <span className={`font-bold text-lg md:text-xl ${totalCredits > CREDIT_LIMIT ? 'text-red-600' : 'text-green-600'}`}>
            {totalCredits} / {CREDIT_LIMIT}
          </span>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-2.5 mb-4 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${totalCredits > CREDIT_LIMIT ? 'bg-red-500' : 'bg-gradient-to-r from-blue-400 to-blue-600'}`}
            style={{ width: `${Math.min((totalCredits / CREDIT_LIMIT) * 100, 100)}%` }}
          ></div>
        </div>
        <details className="group">
            <summary className="font-semibold text-gray-700 text-sm cursor-pointer list-none flex justify-between items-center hover:text-blue-600">
                Specific Requirements
                <span className="text-xs transition-transform duration-200 group-open:rotate-180">▼</span>
            </summary>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 text-xs md:text-sm border-t border-gray-300 pt-2">
              {REQUIRED_CREDIT_VALUES.map(creditValue => (
                <div key={creditValue} className="flex justify-between items-center">
                  <span className="text-gray-600">{creditValue}-Credit:</span>
                  <span className={`font-semibold py-0.5 px-1.5 rounded ${getConstraintStatusColor(selectedCreditCounts[creditValue], TARGET_CREDIT_COUNTS[creditValue]).replace('text-', 'bg-').replace('-600', '-100')}`}>
                    {selectedCreditCounts[creditValue]} / {TARGET_CREDIT_COUNTS[creditValue]}
                  </span>
                </div>
              ))}
            </div>
        </details>
         {totalCredits > CREDIT_LIMIT && (
          <p className="text-red-600 text-xs mt-2 text-center font-medium animate-pulse">Overall credit limit exceeded!</p>
        )}
      </div>

      {/* Filter, Sort, Search Controls */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 border border-gray-200 flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative flex-grow w-full md:w-auto">
          {/* Removed icon span */}
          <input
            type="text"
            placeholder="Search by Name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // Removed pl-10, added standard padding
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-transparent outline-none text-sm shadow-sm"
          />
        </div>
        {/* Filter */}
        <div className="relative w-full md:w-auto">
           {/* Removed icon span */}
          <select
            value={filterCredits}
            onChange={(e) => setFilterCredits(e.target.value)}
            // Removed pl-8, added standard padding
            className="w-full appearance-none px-4 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-transparent outline-none text-sm bg-white shadow-sm"
          >
            {uniqueCreditOptions.map(credit => (
              <option key={credit} value={credit}>
                {credit === 'all' ? 'Filter Credits' : `${credit} Credit${credit > 1 ? 's' : ''}`}
              </option>
            ))}
          </select>
           <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">▼</span>
        </div>
        {/* Sort */}
        <div className="relative w-full md:w-auto">
           {/* Removed icon span */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            // Removed pl-8, added standard padding
            className="w-full appearance-none px-4 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-transparent outline-none text-sm bg-white shadow-sm"
          >
            <option value="name-asc">Sort: Name (A-Z)</option>
            <option value="credits-asc">Sort: Credits (Low-High)</option>
            <option value="credits-desc">Sort: Credits (High-Low)</option>
          </select>
           <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">▼</span>
        </div>
      </div>

      {/* Available Courses List */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-gray-200 min-h-[300px]">
        <h4 className="text-xl font-semibold mb-5 text-gray-700 border-b pb-2"> Available Courses ({displayCourses.length}) </h4>
        {displayCourses.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {displayCourses.map((course) => {
              const isSelected = selectedCourses.has(course.id);
              let isDisabled = false; let disabledReason = '';
              if (!isSelected) {
                if (totalCredits + course.credits > CREDIT_LIMIT) { isDisabled = true; disabledReason = 'Exceeds total credit limit'; }
                else if (TARGET_CREDIT_COUNTS.hasOwnProperty(course.credits) && selectedCreditCounts[course.credits] >= TARGET_CREDIT_COUNTS[course.credits]) { isDisabled = true; disabledReason = `Max ${course.credits}-credit courses selected`; }
              }
              return (
                <div key={course.id} title={isDisabled ? disabledReason : ''} className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg transition-all duration-200 ease-in-out shadow-sm hover:shadow-md ${ isSelected ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 ring-1 ring-blue-200' : 'border-gray-200 bg-white' } ${isDisabled ? 'opacity-65 cursor-not-allowed' : ''}`}>
                  <div className="mb-3 sm:mb-0 flex-grow mr-4">
                    <p className="font-semibold text-base text-gray-800">{course.name}</p>
                    <p className="text-sm text-gray-500"> <span className="font-medium">ID:</span> {course.id} | <span className="font-medium">Credits:</span> {course.credits} </p>
                    {isDisabled && <p className="text-xs text-red-500 mt-1">{disabledReason}</p>}
                  </div>
                  <button onClick={() => handleToggleSelect(course.id)} disabled={isDisabled} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 flex-shrink-0 shadow-sm border ${ isSelected ? 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200' : isDisabled ? 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed' : 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200 hover:shadow-md' }`} aria-label={isSelected ? `Deselect ${course.name}` : `Select ${course.name}`}>
                    {/* Replaced icons with text/symbols */}
                    {isSelected ? ( <> <span className="font-bold text-base leading-none -mt-0.5">×</span> Deselect </> ) : ( <> <span className="font-bold text-base leading-none -mt-0.5">+</span> Select </> )}
                  </button>
                </div> );
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
             {/* Removed SVG icon */}
            <h3 className="mt-2 text-sm font-medium text-gray-900">No courses found</h3>
            <p className="mt-1 text-sm text-gray-500">No courses match your current filter or search term.</p>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="mt-10 text-center">
        <button onClick={handleSubmitEnrollment} disabled={!constraintsMet || totalCredits > CREDIT_LIMIT || selectedCourses.size === 0} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold px-10 py-3 rounded-lg shadow-lg hover:shadow-xl hover:from-green-600 hover:to-emerald-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none">
          Submit Enrollment ({selectedCourses.size} {selectedCourses.size === 1 ? 'Course' : 'Courses'})
        </button>
        {!constraintsMet && selectedCourses.size > 0 && ( <p className="text-orange-600 text-sm mt-3 font-medium">Specific credit requirements not yet met.</p> )}
      </div>
    </div>
  );
}

export default CourseEnroll;