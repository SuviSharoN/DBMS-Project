// Backend/Models/attendanceModel.js
import { DataTypes } from "sequelize";
import sequelize from '../Configuration/dbConnect.js';

const Attendance = sequelize.define(
    "Attendance",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        student_id: { // Foreign Key to Student table
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'Students', key: 'id' }
        },
        faculty_course_id: { // Foreign Key to the specific course offering
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'facultyCourses', key: 'id' }
        },
        date: { // The date the class was held
            type: DataTypes.DATEONLY, // Stores only YYYY-MM-DD
            allowNull: false,
        },
        status: { // 'Present', 'Absent', 'Late', 'Excused' etc.
            type: DataTypes.ENUM('Present', 'Absent', 'Late', 'Excused'), // Define your statuses
            allowNull: false,
        }
    },
    {
        tableName: 'attendance', // Back to original table name
        timestamps: true,
        indexes: [
            {
                // Unique record per student, per offering, per date
                unique: true,
                fields: ['student_id', 'faculty_course_id', 'date']
            }
        ]
    }
);

export default Attendance;