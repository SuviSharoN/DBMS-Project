// Backend/Models/facultyCoursesModel.js
import { DataTypes } from "sequelize";
import sequelize from "../Configuration/dbConnect.js"; // Assuming db connection setup
// Import associated models IF you define associations here and need them
// import Faculty from './facultyModel.js'; // Example
// import Course from './courseModel.js';   // Example
// import Enrollment from './enrollmentModel.js'; // Needed for calculating enrolled count later

// Use PascalCase for Model name convention
const FacultyCourse = sequelize.define("FacultyCourse", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    faculty_id: {
        type: DataTypes.INTEGER, // Ensure this matches the primary key type of your Faculty model
        allowNull: false,
        references: {
            model: 'faculties', // The TABLE name for faculties (use the actual table name)
            key: 'id'           // The primary key column name in the faculties table
        },
        onUpdate: 'CASCADE', // Optional: What happens if the referenced faculty ID changes
        onDelete: 'RESTRICT' // Optional: Prevent deleting faculty if they have courses assigned (or SET NULL, CASCADE)
    },
    course_id: {
        type: DataTypes.STRING, // Ensure this matches the primary key type of your Course model
        allowNull: false,
        references: {
            model: 'courses',   // The TABLE name for courses (use the actual table name)
            key: 'id'           // The primary key column name in the courses table
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    },
    // --- Added Capacity Field (Determines Available Seats) ---
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,       // Make capacity mandatory for every offering
        defaultValue: 25,       // Sensible default like 25, or use 0 to force admin setting
        validate: {
            min: 0              // Capacity cannot be negative
        },
        comment: "Maximum number of students allowed in this specific course offering." // Optional comment for DB schema
    }
    // --- End Added Field ---
}, {
    tableName: 'facultycourses', // Explicitly set table name (use snake_case convention)
    timestamps: true,           // Keep timestamps if you need createdAt/updatedAt
    indexes: [
        // Ensure a faculty cannot offer the same course multiple times
        {
            unique: true,
            fields: ['faculty_id', 'course_id'],
            name: 'faculty_course_unique_idx' // Optional: Give the index a specific name
        },
        // Optional: Index capacity if you frequently query courses with available seats
        // {
        //   fields: ['capacity'],
        //   name: 'faculty_course_capacity_idx'
        // }
    ]
});

// --- Associations (Recommended way) ---
// Define associations AFTER all models have been defined.
// This is typically done in a central file (e.g., models/index.js)
// where all models are imported and associations are set up.

// Example Structure (if defining associations elsewhere):
/*
// In models/index.js or similar setup file:
const db = {};
// ... import models ...
db.FacultyCourse = require('./facultyCoursesModel')(sequelize, DataTypes);
db.Faculty = require('./facultyModel')(sequelize, DataTypes);
db.Course = require('./courseModel')(sequelize, DataTypes);
db.Enrollment = require('./enrollmentModel')(sequelize, DataTypes);

// Define Associations:
db.FacultyCourse.belongsTo(db.Faculty, { foreignKey: 'faculty_id', as: 'faculty' });
db.Faculty.hasMany(db.FacultyCourse, { foreignKey: 'faculty_id', as: 'offerings' }); // Optional inverse

db.FacultyCourse.belongsTo(db.Course, { foreignKey: 'course_id', as: 'course' });
db.Course.hasMany(db.FacultyCourse, { foreignKey: 'course_id', as: 'offerings' }); // Optional inverse

db.FacultyCourse.hasMany(db.Enrollment, { foreignKey: 'facultyCourseId', as: 'enrollments' });
db.Enrollment.belongsTo(db.FacultyCourse, { foreignKey: 'facultyCourseId', as: 'offering' }); // Optional inverse

module.exports = db;
*/

// Export using the PascalCase name
export default FacultyCourse;