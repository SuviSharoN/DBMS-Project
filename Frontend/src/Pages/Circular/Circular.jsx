// Circular Component: Displays and manages university circulars with filtering and sorting capabilities
// Features: Search by title, filter by category, sort by date/title, and download attachments

// src/Components/Circular.js
import React, { useState, useEffect, useMemo } from 'react';
// Removed imports handled by Layout.js

// --- Mock Data ---
const MOCK_CIRCULARS = [
    { id: 'circ-001', title: "Exam Timetable Released - April 2024", date: "2024-03-20", category: "Exams", issuedBy: "Exam Cell",  attachmentUrl: "/files/exam_timetable_apr24.pdf" },
    { id: 'circ-002', title: "Workshop on AI & ML Applications", date: "2024-03-15", category: "Events", issuedBy: "CSE Department", attachmentUrl: "/files/ai_ml_workshop.pdf" },
    { id: 'circ-003', title: "Holiday Notice - Tamil New Year", date: "2024-04-10", category: "Holiday", issuedBy: "Admin Office", attachmentUrl: "/files/holiday_notice_apr14.pdf" },
    { id: 'circ-004', title: "Techofest Circular - Event Schedule", date: "2024-03-06", category: "Festival", issuedBy: "Dean Office", attachmentUrl: "/files/techofest_schedule.pdf" },
    { id: 'circ-005', title: "Library Hour Changes During Exams", date: "2024-03-18", category: "General", issuedBy: "Library", attachmentUrl: null }, // No attachment example
    { 
        id: 'circ-006', 
        title: "Guest Lecture on Cloud Security", 
        date: "2024-04-05", 
        category: "Events", 
        issuedBy: "IT Department", 
        attachmentUrl: "https://drive.google.com/uc?export=download&id=1piLI2NGzLnJP86hWX-Af1NxQTzsVC8rs" 
    },
    { 
        id: 'circ-007', 
        title: "Internal Assessment Schedule", 
        date: "2024-03-25", 
        category: "Exams", 
        issuedBy: "Exam Cell", 
        attachmentUrl: "https://drive.google.com/uc?export=download&id=1K2XpNhuKGEwKtphgv5cgb7guIUVFdx0h" 
    },
];

// --- Component ---
function Circular() {
  // State
  const [allCirculars, setAllCirculars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortOption, setSortOption] = useState('date-desc'); // date-desc, date-asc, title-asc, category-asc

  // --- Simulate Fetching Data ---
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      try {
        // Add unique IDs if not present and sort initially by date descending
        const processedCirculars = MOCK_CIRCULARS.map((c, index) => ({
            ...c,
            id: c.id || `circ-${String(index).padStart(3, '0')}` // Ensure ID
        })).sort((a, b) => new Date(b.date) - new Date(a.date)); // Initial sort

        setAllCirculars(processedCirculars);
        setError(null);
      } catch (err) {
        console.error("Failed to load circulars:", err);
        setError("Failed to load circulars. Please try again.");
        setAllCirculars([]);
      } finally {
        setIsLoading(false);
      }
    }, 400); // Simulate loading
    return () => clearTimeout(timer);
  }, []);

  // --- Derive Categories for Filter ---
  const uniqueCategories = useMemo(() => {
    const categories = [...new Set(allCirculars.map(c => c.category))].sort();
    return ['all', ...categories];
  }, [allCirculars]);

  // --- Derive Displayed Circulars based on Filter/Sort/Search ---
  const displayCirculars = useMemo(() => {
    let filtered = [...allCirculars];

    // 1. Filter by Category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(c => c.category === filterCategory);
    }

    // 2. Filter by Search Term (Title)
    if (searchTerm.trim() !== '') {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // 3. Sort
    const [sortBy, sortDir] = sortOption.split('-');
    const direction = sortDir === 'asc' ? 1 : -1;

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }
      // Apply direction and secondary sort by date descending if primary is equal
      return comparison * direction || (new Date(b.date) - new Date(a.date));
    });

    return filtered;
  }, [allCirculars, searchTerm, filterCategory, sortOption]);

  // --- Event Handlers ---
  const handleDownload = (url, title) => {
    if (!url) {
        alert(`No attachment available for "${title}".`);
        return;
    }

    // Trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = title; // Optional: Set a custom filename
    link.target = '_blank'; // Open in a new tab
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

  // --- Render Logic ---
  if (isLoading) return <div className="flex justify-center items-center h-40"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div></div>;
  if (error) return <div className="text-center p-10 text-red-600 bg-red-100 rounded-lg">{error}</div>;

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-6xl">
      <h3 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800 tracking-tight">
        University Circulars
      </h3>

      {/* Controls: Search, Filter, Sort */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 border border-gray-200 flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative flex-grow w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by Title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-300 focus:border-transparent outline-none text-sm shadow-sm"
          />
           {/* Optional: Add a search icon */}
        </div>
        {/* Filter Category */}
        <div className="relative w-full md:w-auto">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full appearance-none px-4 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-300 focus:border-transparent outline-none text-sm bg-white shadow-sm"
          >
            {uniqueCategories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">▼</span>
        </div>
        {/* Sort Options */}
        <div className="relative w-full md:w-auto">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full appearance-none px-4 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-300 focus:border-transparent outline-none text-sm bg-white shadow-sm"
          >
            <option value="date-desc">Sort: Date (Newest)</option>
            <option value="date-asc">Sort: Date (Oldest)</option>
            <option value="title-asc">Sort: Title (A-Z)</option>
            <option value="category-asc">Sort: Category (A-Z)</option>
          </select>
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">▼</span>
        </div>
      </div>

      {/* Circulars Display (Table) */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-sm">
            {/* Table Header */}
            <thead className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 uppercase tracking-wider">
              <tr>
                <th className="p-3 text-left font-semibold">Title</th>
                <th className="p-3 text-center font-semibold w-32">Date</th> {/* Fixed width */}
                <th className="p-3 text-left font-semibold w-36">Category</th> {/* Fixed width */}
                <th className="p-3 text-left font-semibold w-48">Issued By</th> {/* Fixed width */}
                <th className="p-3 text-center font-semibold w-28">Attachment</th> {/* Fixed width */}
              </tr>
            </thead>
            {/* Table Body */}
            <tbody className="divide-y divide-gray-200">
              {displayCirculars.length > 0 ? (
                displayCirculars.map((circular) => (
                  <tr key={circular.id} className="hover:bg-gray-50/80 transition-colors duration-150">
                    {/* Title */}
                    <td className="p-3 text-left font-medium text-gray-800">{circular.title}</td>
                    {/* Date */}
                    <td className="p-3 text-center text-gray-600">{circular.date}</td>
                    {/* Category */}
                    <td className="p-3 text-left">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                            {circular.category}
                        </span>
                    </td>
                    {/* Issued By */}
                    <td className="p-3 text-left text-gray-700">{circular.issuedBy}</td>
                    {/* Attachment Button */}
                    <td className="p-3 text-center">
                      {circular.attachmentUrl ? (
                        <button
                          onClick={() => handleDownload(circular.attachmentUrl, circular.title)}
                          className="px-3 py-1 rounded-md text-xs font-medium bg-green-600 text-white hover:bg-green-700 transition duration-150 shadow-sm flex items-center justify-center gap-1 mx-auto" // Centered button
                          aria-label={`Download attachment for ${circular.title}`}
                        >
                          {/* Simple Download Symbol */}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          <span>Download</span>
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs italic">None</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                // No Circulars Message
                <tr>
                  <td colSpan="5" className="text-center p-10 text-gray-500">
                    No circulars match your current filter/search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Circular;