// Backend/Models/facultyCoursesModel.js (Assuming file name convention)
import { DataTypes } from "sequelize";
import sequelize from "../Configuration/dbConnect.js";

const facultyCourse = sequelize.define("facultyCourse", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    faculty_id: {
        type: DataTypes.INTEGER, // *** MUST MATCH Faculty's ID TYPE ***
        allowNull: false,
        references: { model: 'faculties', key: 'id' } // Direct reference needed for FK constraint
    },
    course_id: {
        type: DataTypes.STRING, // *** MUST MATCH Course's ID TYPE ***
        allowNull: false,
        references: { model: 'courses', key: 'id' } // Direct reference
    }
    // No available_seats
}, {
    tableName: 'facultyCourses', // Make sure table name is correct
    timestamps: true, // You had timestamps true here
    indexes: [
        { unique: true, fields: ['faculty_id', 'course_id'] }
    ]
});

// Removed the .associate method

export default facultyCourse;