// Backend/Models/facultyModel.js (Example)
import { DataTypes } from "sequelize";
import sequelize from "../Configuration/dbConnect.js";

const Faculty = sequelize.define("Faculty", {
    id: {
        type: DataTypes.INTEGER, // Or STRING/UUID etc.
        // autoIncrement: true, // Only if INTEGER
        primaryKey: true,
         allowNull: false // Ensure IDs are always provided or generated
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true // Usually faculty names should be unique
    },
    // Assuming password is required for login as per your auth controller
    password: {
         type: DataTypes.STRING,
         allowNull: false // Required for login
     }
    // Add other fields like department, email, etc. if needed
}, {
    tableName: 'faculties',
    timestamps: false // Or true if you want timestamps
});

// Removed the .associate method

export default Faculty;