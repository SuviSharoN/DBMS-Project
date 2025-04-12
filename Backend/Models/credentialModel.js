// Backend/Models/credentialModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../Configuration/dbConnect.js';
// No need to import Student here if association defined in server.js

const Credential = sequelize.define('Credential', {
    id: { // Auto-incrementing primary key for the credential entry itself
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    student_id: { // Foreign key referencing the actual Student record
        type: DataTypes.INTEGER, // *** MUST MATCH Student.id TYPE ***
        allowNull: false,
        unique: true, // Each student should only have one credential entry
        references: {
            model: 'Students', // Correct table name
            key: 'id'          // Correct primary key in Students table
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'credentials',
    timestamps: true // You had this in the log, keep or remove as needed
});

// No .associate needed here if handled in server.js

export default Credential;