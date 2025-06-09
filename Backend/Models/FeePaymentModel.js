// Backend/Models/feePaymentModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../Configuration/dbConnect.js';
import Student from './studentModel.js';

const FeePayment = sequelize.define('FeePayment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Student,
            key: 'id',
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
    },
    dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: 'due_date'
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Paid'),
        allowNull: false,
        defaultValue: 'Pending',
    },
    documentUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'document_url'
    }
}, {
    tableName: 'fee_payments',
    timestamps: true
});

// --- Optional: Define the association explicitly here as well ---
// Although primarily defined in server.js, it can be helpful here for clarity
// or if using Sequelize CLI features.
// Student.hasMany(FeePayment, { foreignKey: 'student_id' });
// FeePayment.belongsTo(Student, { foreignKey: 'student_id' });

export default FeePayment;