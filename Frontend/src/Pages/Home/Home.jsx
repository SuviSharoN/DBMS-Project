// Home Component: Main routing container for authenticated user pages
// Features: Role-based route management and component rendering

import { Route,Routes } from "react-router-dom";
import Contact  from "../Contact/Contact.jsx";
import Fee from "../Fee/Feepayment.jsx";
import Circular from '../Circular/Circular.jsx';
import Attendance from '../Attendance/Attendance';
import Timetable from '../Timetable/Timetable.jsx';
import Dashboard from '.../Components/Dashboard'

const Home = () =>{

    return(
        <Routes>
            <Route path = '/' element={<Dashboard/>}></Route>
            <Route path ='/contact' element={<Contact/>}></Route>
            <Route path ='/fee' element={<Fee/>}></Route>
            <Route path = '/circular' element={<Circular/>}></Route>
            <Route path = '/attendance' element = {<Attendance/>}></Route>
            <Route path = '/timetable' element ={<Timetable/>}></Route>
        </Routes>
    )
}
export default Home;