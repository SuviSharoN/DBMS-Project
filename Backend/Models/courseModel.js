// Backend/Models/courseModel.js (Assuming file name convention)
import { DataTypes } from "sequelize";
import sequelize from "../Configuration/dbConnect.js"; // Your configured Sequelize instance

const Course = sequelize.define("Course", {
    id: { // e.g., "CS101"
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    course_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    credits: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 } // Adjust max if needed
    }
    // NO faculty_id or faculty_name here
}, {
    tableName: 'courses',
    timestamps: false
});

// Removed the .associate method

export default Course; // Export the model directly