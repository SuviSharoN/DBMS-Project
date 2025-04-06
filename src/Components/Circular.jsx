import { useState } from "react";
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate

function Circular() {
  const navigate = useNavigate(); // 2. Instantiate useNavigate
  const annaunivlogo = "/annaunivlogo.jpg";
  const name = "SaravanaKumar B";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutSidebarOpen, setLogoutSidebarOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const [circulars, setCirculars] = useState([
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
      date: "2025-03-06",
      category: "Festival",
      issuedBy: "Dean",
      attachment: "Download",
    }
  ]);

  // --- Handle Logout with Confirmation ---
  // 3. Create handleLogout function
  const handleLogout = () => {
    const isConfirmed = window.confirm("Are you sure you want to sign out?");
    if (isConfirmed) {
      // TODO: Add actual sign-out logic here (e.g., clear tokens, reset state)
      console.log("Signing out confirmed...");
      setLogoutSidebarOpen(false); // Close the dropdown
      navigate('/login'); // Navigate to the login page ONLY if confirmed
    } else {
      console.log("Sign out cancelled.");
    }
  };


  const sortCircularsByDate = () => {
    const sortedCirculars = [...circulars].sort((a, b) => {
      return sortOrder === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    });
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setCirculars(sortedCirculars);
  };

  // --- Your existing JSX structure and CSS ---
  return (
    <>
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#07899d] to-[#22d3ee] shadow-lg rounded-md">
        <div className="flex items-center gap-4">
          <img src={annaunivlogo} alt="Anna Univ Logo" className="w-12 h-12 rounded-full" />
          <h1 className="text-white text-lg font-bold">Circular</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white text-2xl">☰</button>
        </div>
        <div className="relative">
          <div className="flex items-center gap-3">
            <img src={annaunivlogo} alt="Profile" className="w-10 h-10 rounded-full" />
            <div>
              <h4 className="text-white text-sm font-medium">{name}</h4>
              <button onClick={() => setLogoutSidebarOpen(!logoutSidebarOpen)} className="bg-white text-black px-3 py-1 text-sm rounded-md">▼</button>
            </div>
          </div>
          {logoutSidebarOpen && (
            <div className="absolute right-0 mt-2 bg-white text-black rounded-md shadow-lg p-2">
              {/* 4. Update the onClick handler for the Log Out button */}
              <button
                onClick={handleLogout} // Use the new handler
                className="block w-full text-left px-4 py-2 hover:bg-gray-200"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={`fixed top-0 left-0 w-64 h-full bg-gradient-to-r from-teal-700 to-cyan-400 text-white p-5 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300`}>
        <button onClick={() => setSidebarOpen(false)} className="text-xl">×</button>
        <div className="mt-5 flex flex-col gap-3">
          {/* NOTE: Sidebar buttons still lack navigation functionality as requested */}
          {["Dashboard", "Circular", "Attendance", "Contact", "Time Table", "Course Enroll"].map((item) => (
            <button key={item} className="bg-white text-blue-800 p-2 rounded-md hover:bg-blue-200">{item}</button>
          ))}
        </div>
      </div>

      <div className="container mx-auto mt-8 p-4 max-w-4xl">
        <h3 className="text-lg font-bold text-center mb-4">Latest Circulars</h3>
        <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md">
          <button onClick={sortCircularsByDate} className="mb-3 px-4 py-2 bg-blue-600 text-white rounded-md">
            Sort by Date ({sortOrder === "asc" ? "Ascending" : "Descending"})
          </button>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-cyan-400 text-white">
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Issued By</th>
                <th className="p-2 border">Attachment</th>
              </tr>
            </thead>
            <tbody>
              {circulars.map((circular, index) => (
                <tr key={index} className="text-center border">
                  <td className="p-2 border">{circular.title}</td>
                  <td className="p-2 border">{circular.date}</td>
                  <td className="p-2 border">{circular.category}</td>
                  <td className="p-2 border">{circular.issuedBy}</td>
                  <td className="p-2 border">
                    {/* NOTE: Download button still lacks functionality */}
                    {circular.attachment === "Download" ? <button className="bg-blue-600 text-white px-3 py-1 rounded-md">Download</button> : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Circular;