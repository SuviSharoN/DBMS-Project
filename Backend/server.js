import express from 'express';
import {dbConnect} from './Config/dbConnect.js'
import Student from './Models/studentModel.js'
import  dotenv from "dotenv";
import Contact from './Models/contactModel.js';
dotenv.config();

const app = express();
app.use(express.json());
let count = 1;
app.post('/api/students' , async (req , res) =>{
    count++;
    try {
        const {id , name , email , dob , gender , category , reservation , phone , address , guardian_name , guardian_phone} = req.body;
        if(!id || !name || !email || !dob || !gender || !category || !phone || !address || !guardian_name || !guardian_phone )
            return res.status(400).json({success : false , message : "Please provide all fields"});
        const newStudent = await Student.create({id ,name , email , dob , gender , category});
        const newContact = await Contact.create({student_id:id ,  phone , address , guardian_name , guardian_phone});
        res.status(200).json({success : true , data :{ newStudent , newContact}});
    } catch (error) {
        console.log("Error in creating student" , error);
        res.status(500).json({success : false , message : "Server Error"});
    }
});
app.listen(5000,()=>{
    dbConnect();
    console.log(`Server is running on port 5000`);
})