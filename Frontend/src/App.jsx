// Main Application Router: Defines all routes and their access control
// Implements role-based access control (RBAC) for Student, Faculty, and Admin users

import { Routes, Route, Navigate } from "react-router-dom";
import Contact from "./Pages/Contact/Contact";
import Login from "./Loginpage/Login";
import Dashboard from "./Components/Dashboard";
import Feepayment from "./Pages/Fee/Feepayment";
import Circular from "./Pages/Circular/Circular";
import RegisterPage from "./Loginpage/StudentRegister.jsx";
import RegisterOptions from "./Loginpage/RegisterOptions";
import FacultyRegister from "./Loginpage/Facultyregister";
import AdminRegister from "./Loginpage/AdminRegister";
import FacultyDashboard from "./Components/FacultyDashboard";
import AdminDashboard from "./Components/AdminDashboard";
import TimeTable from "./Pages/Timetable/Timetable.jsx";
import StudentAttendance from "./Pages/Attendance/StudentAttendance.jsx";
import FacultyAttendance from "./Pages/Attendance/FacultyAttendance.jsx";
import AdminCourseManagement from "./Pages/Enrollment/AdminCourseManagement.jsx";
import StudentEnrollment from "./Pages/Enrollment/StudentEnrollment.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";

function App() {
  return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registeroptions" element={<RegisterOptions />} />
        <Route path="/student-register" element={<RegisterPage />} />
        <Route path="/faculty-register" element={<FacultyRegister />} />
        <Route path="/admin-register" element={<AdminRegister />} />
        <Route element={<ProtectedRoute allowedRoles={['Student']} />}>
          <Route path="/dashboard/:id" element={<Dashboard />} />
          <Route path="/dashboard/attendance" element={<StudentAttendance />} />
          <Route path="/dashboard/contact" element={<Contact />} />
          <Route path="/dashboard/circular" element={<Circular />} />
          <Route path="/dashboard/fee" element={<Feepayment />} />
          <Route path="/dashboard/timetable" element={<TimeTable />} />
          <Route path="/dashboard/course-enroll" element={<StudentEnrollment />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['Faculty']} />}>
          <Route path="/faculty_dashboard/:id" element={<FacultyDashboard />} />
          <Route path = "/faculty_dashboard/attendance" element = {<FacultyAttendance/>}/>
          <Route path="/faculty_dashboard/contact" element={<Contact />} />
          <Route path="/faculty_dashboard/circular" element={<Circular />} />
          <Route path="/faculty_dashboard/fee" element={<Feepayment />} />
          <Route path="/faculty_dashboard/timetable" element={<TimeTable />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
          <Route path="/admin/dashboard/:id" element={<AdminDashboard />} />
          <Route path="/admin/course-enroll" element={<AdminCourseManagement />} />
          <Route path="/admin/attendance" element={<StudentAttendance />} />
          <Route path="/admin/contact" element={<Contact />} />
          <Route path="/admin/circular" element={<Circular />} />
          <Route path="/admin/fee" element={<Feepayment />} />
          <Route path="/admin/timetable" element={<TimeTable />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
}

export default App;