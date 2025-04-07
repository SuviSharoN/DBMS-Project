// src/Components/Circular.js
import { useState } from "react";
// Removed useNavigate, Link as they are handled by Layout.js now
// Removed useState for sidebarOpen, logoutSidebarOpen

function Circular() {
  // Keep state and functions specific to the Circulars content
  const [sortOrder, setSortOrder] = useState("desc"); // Default to 'desc' for newest first
  const [circulars, setCirculars] = useState([
    // Your circulars data remains the same
    {
        title: "Exam Timetable Released",
        date: "2024-03-20",
        category: "Exams",
        issuedBy: "Exam Cell",
        attachment: "Download",
      },
      {
        title: "Workshop on AI & ML",
        date: "2024-03-15",
        category: "Events",
        issuedBy: "CSE Department",
        attachment: "Download",
      },
      {
        title: "Holiday Notice - April 1st",
        date: "2024-03-10",
        category: "Holiday",
        issuedBy: "Dean",
        attachment: "Download",
      },
      {
          title: "Techofest Cicular - March 6",
        date: "2025-03-06", // Note: Year is 2025 here
        category: "Festival",
        issuedBy: "Dean",
        attachment: "Download",
      }
  ]);

  // --- Sort Circulars ---
  // Sort initially on component mount if needed (optional)
  // useEffect(() => {
  //   sortCircularsByDate(true); // Pass flag to sort initially without toggling order
  // }, []); // Empty dependency array means run once on mount

  const sortCircularsByDate = (initialSort = false) => {
    const currentSortOrder = initialSort ? 'desc' : sortOrder; // Use 'desc' for initial sort if specified
    const sortedCirculars = [...circulars].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      // Sort descending (newest first) if currentSortOrder is 'desc'
      return currentSortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    // Only toggle order if it's not the initial sort
    if (!initialSort) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
        setSortOrder('desc'); // Ensure state matches initial sort order
    }
    setCirculars(sortedCirculars);
  };


  // --- JSX for Circular Content ONLY ---
  // No <>, Header, or Sidebar here. That's handled by Layout.js
  return (
    // The container div might not be needed if Layout provides padding, but keep for structure
    <div className="container mx-auto p-4 max-w-4xl"> {/* Adjust padding/margin if Layout handles it */}
      <h3 className="text-2xl font-bold text-center mb-6 text-gray-700">Latest Circulars</h3>
      <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md">
        {/* Sort Button */}
        <div className="mb-4">
          <button
             onClick={() => sortCircularsByDate()} // Call without flag for toggling
             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-colors duration-150"
          >
            Sort by Date ({sortOrder === "desc" ? "Newest First" : "Oldest First"})
          </button>
        </div>
        {/* Circulars Table */}
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-cyan-500 text-white">
              <th className="p-3 border text-left">Title</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border text-left">Category</th>
              <th className="p-3 border text-left">Issued By</th>
              <th className="p-3 border">Attachment</th>
            </tr>
          </thead>
          <tbody>
            {circulars.length > 0 ? (
              circulars.map((circular, index) => (
                <tr key={index} className="text-center border hover:bg-gray-100 transition-colors duration-150">
                  <td className="p-3 border text-left">{circular.title}</td>
                  <td className="p-3 border">{circular.date}</td>
                  <td className="p-3 border text-left">{circular.category}</td>
                  <td className="p-3 border text-left">{circular.issuedBy}</td>
                  <td className="p-3 border">
                    {circular.attachment === "Download" ? (
                      <button className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 text-sm transition-colors duration-150">
                        Download
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">No circulars found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    // No closing </> needed
  );
}

export default Circular;