// Main Server Application: Express.js backend with Sequelize ORM integration
// Features: Database associations, route handling, middleware setup, and server initialization

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Sequelize instance first
import sequelize from './Configuration/dbConnect.js';

// Import ALL model definitions
import Course from './Models/courseModel.js';
import Faculty from './Models/facultyModel.js';
import facultyCourse from './Models/facultyCoursesModel.js';
import Enrollment from './Models/enrollmentModel.js';
import Credential from './Models/credentialModel.js'; // Student login model
import Admin from './Models/adminModel.js';       // Admin login model
import Student from './Models/studentModel.js';   // The main Student model
import Attendance from './Models/attendanceModel.js';
// Import route handlers
import courseRoutes from './Routes/courseRoutes.js';
import facultyRoutes from './Routes/facultyRoutes.js';
import facultyCoursesRoutes from './Routes/facultyCoursesRoutes.js';
import offeringRoutes from './Routes/offeringRoutes.js';
import enrollmentRoutes from './Routes/enrollmentRoutes.js';
import adminRoutes from './Routes/adminRoutes.js';
import authenroutes from './Routes/authenticationRoutes.js';
import studentRoutes from './Routes/studentRoutes.js'; // Add if you have routes for managing students
import attendanceRoutes from './Routes/attendanceRoutes.js';
import FeePayment from './Models/FeePaymentModel.js';
import feeRoutes from './Routes/feeRoutes.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; // Use PORT from env
app.use((req, res, next) => {
    console.log(`*** GLOBAL LOGGER: Received request: ${req.method} ${req.originalUrl} ***`);
    next(); // !!! IMPORTANT: Always call next() in global middleware unless intentionally ending response
});
// --- CORS Setup ---
app.use(cors({ /* your config */ }));
app.options('*', cors());


// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- MANUAL ASSOCIATION DEFINITION ---
console.log("Defining model associations manually...");
try {
    // Course <-> Faculty (Many-to-Many through facultyCourse)
    Course.belongsToMany(Faculty, { through: facultyCourse, foreignKey: 'course_id', otherKey: 'faculty_id' });
    Faculty.belongsToMany(Course, { through: facultyCourse, foreignKey: 'faculty_id', otherKey: 'course_id' });
    facultyCourse.belongsTo(Course, { foreignKey: 'course_id' });
    Course.hasMany(facultyCourse, { foreignKey: 'course_id' });
    facultyCourse.belongsTo(Faculty, { foreignKey: 'faculty_id' });
    Faculty.hasMany(facultyCourse, { foreignKey: 'faculty_id' });

    // Enrollment -> facultyCourse (Many-to-One)
    Enrollment.belongsTo(facultyCourse, { foreignKey: 'faculty_course_id' });
    facultyCourse.hasMany(Enrollment, { foreignKey: 'faculty_course_id' });

    // *** CORRECTED Student Associations ***
    // Student -> Credential (One-to-One)
    Student.hasOne(Credential, { foreignKey: 'student_id', sourceKey: 'id' }); // Credential FK 'student_id' references Student PK 'id'
    Credential.belongsTo(Student, { foreignKey: 'student_id', targetKey: 'id' }); // Credential FK 'student_id' references Student PK 'id'

    // Enrollment -> Student (Many-to-One)
    Enrollment.belongsTo(Student, { foreignKey: 'student_id', targetKey: 'id' }); // Enrollment FK 'student_id' references Student PK 'id'
    Student.hasMany(Enrollment, { foreignKey: 'student_id', sourceKey: 'id' }); // Enrollment FK 'student_id' references Student PK 'id'
    
    Attendance.belongsTo(Student, { foreignKey: 'student_id' });
    Student.hasMany(Attendance, { foreignKey: 'student_id' });
    Attendance.belongsTo(facultyCourse, { foreignKey: 'faculty_course_id' });
    facultyCourse.hasMany(Attendance, { foreignKey: 'faculty_course_id' });


    Student.hasMany(FeePayment, { foreignKey: 'student_id', sourceKey: 'id' });
    FeePayment.belongsTo(Student, { foreignKey: 'student_id', targetKey: 'id' });

    console.log("Manual associations defined.");
} catch (error) {
    console.error("Error defining manual associations:", error);
}
// --- End Manual Associations ---

// --- API Routes ---
app.use('/api/auth', authenroutes);
app.use('/api/students' , studentRoutes); // Add if needed
app.use('/api/courses', courseRoutes);
// app.use('/api/faculty', (req, res, next) => {
//     console.log(`--> Request received for /api/faculty path: ${req.originalUrl} Method: ${req.method}`);
//     next(); // Pass control to the next matching handler
// });
// 2. Mount the ACTUAL Faculty Routes (Runs SECOND for /api/faculty/*)
app.use('/api/faculty', facultyRoutes);
app.use('/api/facultycourses', facultyCoursesRoutes);
app.use('/api/offerings', offeringRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/attendance',attendanceRoutes);
app.use('/api/fees', feeRoutes);

// --- Server Start Function---
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        // Sync database AFTER associations are defined
        await sequelize.sync({ alter: true }); // Use migrations in prod!
        console.log("All models were synchronized successfully (alter: true).");

        // Start listening ONLY after sync is complete
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (error) {
        console.error('Unable to start server:', error);
        if (error.name && error.name.startsWith('Sequelize')) {
            console.error('Sequelize Error Details:', error);
        }
        process.exit(1);
    }
};

// --- Call Start Server ---
startServer(); // Call the async function

// --- REMOVE Duplicate app.listen ---
// app.listen(PORT, async () => { ... }); // DELETE THIS BLOCK