import { Routes, Route } from "react-router-dom";
import Contact from "./Pages/Contact/Contact";
import Login from "./Loginpage/Login";
import Dashboard from "./Components/Dashboard";
import Feepayment from "./Pages/Fee/Feepayment";
import Circular from "./Pages/Circular/Circular";
import Attendance from "./Pages/Attendance/Attendance";
import RegisterPage from "./Loginpage/Registerpage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RegisterPage/>} />
      <Route path="/dashboard/:id" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
    </Routes>

      // <>
      //   <RegisterPage/>
      // </>
  );
}

export default App;

