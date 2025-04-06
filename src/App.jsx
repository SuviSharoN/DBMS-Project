// src/App.js (or your main routing file)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Loginpage/Login' // Adjust path
import RegisterOptions from './Loginpage/RegisterOptions' // Adjust path
import StudentRegister from './Loginpage/StudentRegisterpage'
import FacultyRegister from './Loginpage/Facultyregister'
import AdminRegister from './Loginpage/AdminRegister'
import Dashboard from './Components/Dashboard'
import Attendance from './Components/Attendance'
import Feepayment from './Components/Feepayment'
import Circular from './Components/Circular'
import Contact from './Components/Contact'

function App() {
  return (
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registeroptions" element={<RegisterOptions />} />
        <Route path="/student-register" element={<StudentRegister />} />
        <Route path="/faculty-register" element={<FacultyRegister />} />
        <Route path="/admin-register" element={<AdminRegister />} />
        <Route path="/dashboard/attendance" element={<Attendance />} />
        <Route path="/dashboard/contact" element={<Contact />} />
        <Route path="/dashboard/circular" element={<Circular />} />
        <Route path="/dashboard/fee" element={<Feepayment />} />

      </Routes>
  );
}

export default App;