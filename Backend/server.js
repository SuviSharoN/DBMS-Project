import express from 'express';
import studentRoutes from './Routes/studentRoutes.js';
import courseRoutes from './Routes/courseRoutes.js';
import facultyRoutes from './Routes/facultyRoutes.js';
import facultyCoursesRoutes from './Routes/facultyCoursesRoutes.js'
import enrollmentRoutes from './Routes/enrollmentRoutes.js'
import sequelize from './Config/dbConnect.js'
import  dotenv from "dotenv";
import authenRoutes from './Routes/authenticationRoutes.js'
import cors from 'cors';
dotenv.config();
import associateModels from './Models/associateModel.js';


const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}));
app.use(express.json());
app.use('/api',authenRoutes);
app.use('/api/students' , studentRoutes);
app.use('/api/courses' , courseRoutes);
app.use('/api/faculty' , facultyRoutes)
app.use('/api/facultycourses' , facultyCoursesRoutes);
app.use('/api/enrollments' , enrollmentRoutes );

app.listen(5000,()=>{
    associateModels();
    console.log(`Server is running on port 5000`);
})