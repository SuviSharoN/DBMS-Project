import { Routes, Route } from "react-router-dom";
import Contact from "./Pages/Contact/Contact";
import Login from "./Loginpage/Login";
import Dashboard from "./Components/Dashboard";
import Feepayment from "./Pages/Fee/Feepayment";
import Circular from "./Pages/Circular/Circular";
import Attendance from "./Pages/Attendance/Attendance";
import RegisterPage from "./Loginpage/StudentRegister.jsx";
import RegisterOptions from "./Loginpage/RegisterOptions";
import FacultyRegister from "./Loginpage/Facultyregister";
import AdminRegister from "./Loginpage/AdminRegister";
import FacultyDashboard from "./Components/FacultyDashboard";
import AdminDashboard from "./Components/AdminDashboard";
import TimeTable from "./Pages/Timetable/Timetable.jsx";
import CourseEnroll from "./Pages/Enrollment/CourseEnroll.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
function App() {
  return (
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/registeroptions" element={<RegisterOptions />} />
        <Route path="/student-register" element={<RegisterPage />} />
        <Route path="/faculty-register" element={<FacultyRegister />} />
        <Route path="/admin-register" element={<AdminRegister />} />
  
        {/* Routes requiring login (any role) */}
        <Route element={<ProtectedRoute />}>
          {/* Generic pages accessible to maybe all logged-in users? Adjust as needed */}
          {/* Example: <Route path="/contact" element={<Contact />} /> */}
          {/* Example: <Route path="/profile" element={<UserProfile />} /> */}
        </Route>
  
        {/* Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={['Student']} />}>
          <Route path="/dashboard/:id" element={<Dashboard />} />
          {/* Put other student-specific pages here */}
          <Route path="/dashboard/attendance" element={<Attendance />} />
          <Route path="/dashboard/contact" element={<Contact />} />
          <Route path="/dashboard/circular" element={<Circular />} />
          <Route path="/dashboard/fee" element={<Feepayment />} />
          <Route path="/dashboard/timetable" element={<TimeTable />} />
          <Route path="/dashboard/course-enroll" element={<CourseEnroll />} />
        </Route>
  
        {/* Faculty Routes */}
        <Route element={<ProtectedRoute allowedRoles={['Faculty']} />}>
          <Route path="/faculty_dashboard/:id" element={<FacultyDashboard />} />
          
        </Route>
  
        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
          <Route path="/admin_dashboard/:id" element={<AdminDashboard />} />
          {/* Put other admin-specific pages here */}
          {/* If CourseEnroll should ALSO be accessible by Admin, add it here too,
              or create a route accessible by both Student and Admin */}
          {/* Example: <Route path="/admin/manage-users" element={<ManageUsers />} /> */}
           {/* Example: If Admin can also enroll/view enrollment */}
           <Route path="/admin/course-enroll" element={<CourseEnroll />} />
        </Route>
  
        {/* Fallback Route - Redirect to login or a 404 page */}
        <Route path="*" element={<Login/>} />
        {/* Or create a NotFound component: <Route path="*" element={<NotFound />} /> */}
  
      </Routes>
    );
}

export default App;

