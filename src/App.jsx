// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages without Layout
import Login from './Loginpage/Login';
import RegisterOptions from './Loginpage/RegisterOptions';
import StudentRegister from './Loginpage/StudentRegisterpage';
import FacultyRegister from './Loginpage/Facultyregister';
import AdminRegister from './Loginpage/AdminRegister';

// Pages WITH Layout
import Layout from './Components/Layout'; // Import the Layout component
import Dashboard from './Components/Dashboard';
import Attendance from './Components/Attendance';
import Feepayment from './Components/Feepayment';
import Circular from './Components/Circular'; // Keep the import
import Contact from './Components/Contact';
// Import other components like TimeTable, CourseEnroll if needed

function App() {
  return ( 
      <Routes>
        {/* Routes WITHOUT the main Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} /> {/* Default to login */}
        <Route path="/registeroptions" element={<RegisterOptions />} />
        <Route path="/student-register" element={<StudentRegister />} />
        <Route path="/faculty-register" element={<FacultyRegister />} />
        <Route path="/admin-register" element={<AdminRegister />} />

        {/* Routes WITH the main Layout */}
        <Route element={<Layout />}> 
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/attendance" element={<Attendance />} />
          <Route path="/dashboard/contact" element={<Contact />} />
          <Route path="/dashboard/circular" element={<Circular />} />
          <Route path="/dashboard/fee" element={<Feepayment />} />
  
        </Route>
      </Routes>
  );
}

export default App;