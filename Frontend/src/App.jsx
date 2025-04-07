import { Routes, Route } from "react-router-dom";
import Contact from "./Pages/Contact/Contact";
import Login from "./Loginpage/Login";
import Dashboard from "./Components/Dashboard";
import Feepayment from "./Pages/Fee/Feepayment";
import Circular from "./Pages/Circular/Circular";
import Attendance from "./Pages/Attendance/Attendance";
import RegisterPage from "./Loginpage/Registerpage";
import RegisterOptions from "./Loginpage/RegisterOptions";
import FacultyRegister from "./Loginpage/Facultyregister";
import AdminRegister from "./Loginpage/AdminRegister";
function App() {
  return (
    <Routes>
      <Route path="/" element={<RegisterPage/>} />
      <Route path="/dashboard/:id" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registeroptions" element={<RegisterOptions />} />
        <Route path="/student-register" element = {<RegisterPage/>}/>
        <Route path="/faculty-register" element={<FacultyRegister />} />
        <Route path="/admin-register" element={<AdminRegister />} />
        <Route path="/dashboard/attendance" element={<Attendance />} />
        <Route path="/dashboard/contact" element={<Contact />} />
        <Route path="/dashboard/circular" element={<Circular />} />
        <Route path="/dashboard/fee" element={<Feepayment />} />
    </Routes>

      // <>
      //   <RegisterPage/>
      // </>
  );
}

export default App;

