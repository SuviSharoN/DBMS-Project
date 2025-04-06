import { useState } from "react";

function Contact() {
  const annaunivlogo = "/annaunivlogo.jpg";
  const name = "SaravanaKumar B";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutSidebarOpen, setLogoutSidebarOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#07899d] to-[#22d3ee] shadow-lg rounded-md">
        <div className="flex items-center gap-4">
          <img src={annaunivlogo} alt="Anna Univ Logo" className="w-12 h-12 rounded-full" />
          <h1 className="text-white text-lg font-bold">Contact</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white text-2xl">&#9776;</button>
        </div>
        <div className="relative">
          <div className="flex items-center gap-3">
            <img src={annaunivlogo} alt="Profile" className="w-10 h-10 rounded-full" />
            <div>
              <h4 className="text-white text-sm font-medium">{name}</h4>
              <button onClick={() => setLogoutSidebarOpen(!logoutSidebarOpen)} className="bg-white text-black px-3 py-1 text-sm rounded-md">&#9660;</button>
            </div>
          </div>
          {logoutSidebarOpen && (
            <div className="absolute right-0 mt-2 bg-white text-black rounded-md shadow-lg p-2">
              <button onClick={() => setLogoutSidebarOpen(false)} className="block w-full text-left px-4 py-2 hover:bg-gray-200">Log Out</button>
            </div>
          )}
        </div>
      </div>

      <div className={`fixed top-0 left-0 w-64 h-full bg-gradient-to-r from-teal-700 to-cyan-400 text-white p-5 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300`}>
        <button onClick={() => setSidebarOpen(false)} className="text-xl">&times;</button>
        <div className="mt-5 flex flex-col gap-3">
          {["Dashboard", "Circular", "Attendance", "Contact", "Time Table", "Course Enroll"].map((item) => (
            <button key={item} className="bg-white text-blue-800 p-2 rounded-md hover:bg-blue-200">{item}</button>
          ))}
        </div>
      </div>

      <div className="container mx-auto mt-8 p-4 max-w-4xl">
        <h3 className="text-lg font-bold text-center mb-4">Contact Us</h3>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-700 mb-2"><strong>Email:</strong> s4tech1234@gmail.com</p>
          <p className="text-gray-700 mb-2"><strong>Phone:</strong> +91 98765 43210</p>
          <p className="text-gray-700 mb-2"><strong>Address:</strong> Anna University, Chennai - 600025</p>
        </div>
        <form className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-bold mb-4">Send a Message</h4>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input type="text" className="w-full p-2 border rounded-md" placeholder="Enter your name" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input type="email" className="w-full p-2 border rounded-md" placeholder="Enter your email" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Message</label>
            <textarea className="w-full p-2 border rounded-md" placeholder="Enter your message"></textarea>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Submit</button>
        </form>
      </div>
    </>
  );
}

export default Contact;