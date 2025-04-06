// src/App.js (or your main routing file)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Loginpage/Login'; // Adjust path
import RegisterOptions from './Loginpage/RegisterOptions'; // Adjust path
import StudentRegister from './Loginpage/StudentRegisterpage'
import FacultyRegister from './Loginpage/Facultyregister';
import AdminRegister from './Loginpage/AdminRegister';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registeroptions" element={<RegisterOptions />} />
        <Route path="/student-register" element={<StudentRegister />} />
        <Route path="/faculty-register" element={<FacultyRegister />} />
        <Route path="/admin-register" element={<AdminRegister />} />

      </Routes>
  );
}

export default App;