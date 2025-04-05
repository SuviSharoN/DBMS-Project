import express from 'express';
import studentRoutes from './Routes/studentRoutes.js';
import courseRoutes from './Routes/courseRoutes.js';
import facultyRoutes from './Routes/facultyRoutes.js';
import facultyCoursesRoutes from './Routes/facultyCoursesRoutes.js'
import enrollmentRoutes from './Routes/enrollmentRoutes.js'
import {dbConnect} from './Config/dbConnect.js'
import  dotenv from "dotenv";

import associateModels from './Models/associateModel.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/students' , studentRoutes);
app.use('/api/courses' , courseRoutes);
app.use('/api/faculty' , facultyRoutes)
app.use('/api/facultycourses' , facultyCoursesRoutes);
app.use('/api/enrollments' , enrollmentRoutes );

app.listen(5000,()=>{
    dbConnect();
    associateModels();
    console.log(`Server is running on port 5000`);
})