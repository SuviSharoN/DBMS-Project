import { Routes, Route, Navigate } from "react-router-dom"; // Import Navigate for fallback/redirects
import Contact from "./Pages/Contact/Contact";
import Login from "./Loginpage/Login";
import Dashboard from "./Components/Dashboard"; // Student Dashboard? Rename for clarity if needed
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

// --- Import BOTH Enrollment Components ---
import AdminCourseManagement from "./Pages/Enrollment/AdminCourseManagement.jsx"; // Admin's version
import StudentEnrollment from "./Pages/Enrollment/studentEnrollment.jsx"; // Student's version

import ProtectedRoute from "./Components/ProtectedRoute.jsx"; // Your protected route component

function App() {
  return (
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/registeroptions" element={<RegisterOptions />} />
        <Route path="/student-register" element={<RegisterPage />} />
        <Route path="/faculty-register" element={<FacultyRegister />} />
        <Route path="/admin-register" element={<AdminRegister />} /> {/* Usually protected */}

        {/* --- Student Routes --- */}
        {/* Wrap all student routes needing protection */}
        <Route element={<ProtectedRoute allowedRoles={['Student']} />}>
          {/* Use :id matching the logged-in user's ID if needed */}
          <Route path="/dashboard/:id" element={<Dashboard />} /> {/* Example: Generic dashboard */}
          {/* Consider nesting under /dashboard/ or keeping separate */}
          <Route path="/students/attendance" element={<Attendance />} />
          <Route path="/contact" element={<Contact />} /> {/* Assuming Contact needs login */}
          <Route path="/circular" element={<Circular />} />
          <Route path="/fee" element={<Feepayment />} />
          <Route path="/timetable" element={<TimeTable />} />
          {/* Assign StudentEnrollment to the student's enrollment path */}
          <Route path="students/course-enroll" element={<StudentEnrollment />} />
        </Route>

        {/* --- Faculty Routes --- */}
        <Route element={<ProtectedRoute allowedRoles={['Faculty']} />}>
           {/* Use :id matching the logged-in user's ID if needed */}
          <Route path="/faculty/dashboard/:id" element={<FacultyDashboard />} />
          {/* Add other faculty-specific routes here */}
          {/* Example: <Route path="/faculty/my-courses" element={<FacultyCourses />} /> */}
        </Route>

        {/* --- Admin Routes --- */}
        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
           {/* Use :id matching the logged-in user's ID if needed */}
          <Route path="/admin/dashboard/:id" element={<AdminDashboard />} />
          {/* Assign AdminCourseManagement to the admin's course management path */}
          <Route path="/admin/course-enroll" element={<AdminCourseManagement />} />
          {/* Add other admin-specific routes here */}
          {/* Example: <Route path="/admin/manage-users" element={<ManageUsers />} /> */}
          {/* Example: <Route path="/admin/manage-faculty" element={<ManageFaculty />} /> */}
        </Route>

        {/* --- Optional: Generic Protected Routes (Any Logged-in User) --- */}
        {/* Use if some pages are for all logged-in users regardless of role */}
        {/* <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<UserProfile />} />
        </Route> */}


        {/* --- Fallback Route --- */}
        {/* Redirect to login if no other route matches AND user is not logged in */}
        {/* Or show a NotFound page */}
        {/* A simple redirect might be sufficient initially */}
        <Route path="*" element={<Navigate to="/login" replace />} />
        {/* Or: <Route path="*" element={<NotFound />} /> */}

      </Routes>
    );
}

export default App;