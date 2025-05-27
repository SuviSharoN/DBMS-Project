// Backend/Models/facultyModel.js
import { DataTypes } from "sequelize";
import sequelize from "../Configuration/dbConnect.js";

const Faculty = sequelize.define("Faculty", {
    id: {
        type: DataTypes.INTEGER, // Or STRING/UUID etc. Keep consistency with faculty_id elsewhere
        // autoIncrement: true, // Only use if INTEGER and you want DB to generate it
        primaryKey: true,
        allowNull: false // Usually IDs are generated or provided
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // --- Added Email Field ---
    email: {
        type: DataTypes.STRING,
        allowNull: false,       // Typically emails are required
        unique: true,           // Ensure email addresses are unique
        validate: {
            isEmail: true       // Add basic email format validation
        }
    },
    // --- Added Department Field ---
    department: {
        type: DataTypes.STRING,
        allowNull: true,        // Or set to false if department is always required
                                // Default is true if not specified
    },
    // --- Existing Password Field ---
    password: {
         type: DataTypes.STRING,
         allowNull: false // Required for login
     }
    // Add other fields if needed
}, {
    tableName: 'faculties', // Ensure this matches your actual table name
    timestamps: false       // Keep timestamps false if you don't need createdAt/updatedAt
    // You might want to add indexes for email or department if you search by them often
    // indexes: [
    //     { unique: true, fields: ['email'] }, // Already covered by unique:true above
    //     { fields: ['department'] }
    // ]
});

// Removed the .associate method (Keep associations defined elsewhere, e.g., server.js or models/index.js)

export default Faculty;