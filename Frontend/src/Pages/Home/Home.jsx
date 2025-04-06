import { Route,Routes } from "react-router-dom";
import Contact  from "../Contact/Contact";
import Fee from "../Fee/Feepayment.jsx";
import Circular from '../Circular/Circular';
import Attendance from '../Attendance/Attendance';
import Timetable from '../Timetable/Timetable';
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