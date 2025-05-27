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
    student_id: { // Foreign Key to Student table
        // --- THIS IS THE CORRECTION ---
        type: DataTypes.INTEGER,  // MUST match the type of Student.id
        // --- END CORRECTION ---
        allowNull: false,
        references: {
            model: Student,       // Reference the imported Student model object
            key: 'id',            // Reference the 'id' primary key column in the Student model
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
    lateFee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        field: 'late_fee'
    },
    reAdmFee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        field: 're_adm_fee'
    },
    penalty: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
    },
    totalAmt: {
         type: DataTypes.DECIMAL(10, 2),
         allowNull: false,
         defaultValue: 0.00,
         field: 'total_amt'
    },
    dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: 'due_date'
    },
    paidOn: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: 'paid_on'
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Paid', 'Failed', 'Cancelled'),
        allowNull: false,
        defaultValue: 'Pending',
    },
    receiptFilename: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'receipt_filename',
    }
}, {
    tableName: 'fee_payments',
    timestamps: false,
    hooks: { // Automatically calculate totalAmt before saving/updating
        beforeValidate: (fee) => {
             const amount = parseFloat(fee.amount) || 0;
             const lateFee = parseFloat(fee.lateFee) || 0;
             const reAdmFee = parseFloat(fee.reAdmFee) || 0;
             const penalty = parseFloat(fee.penalty) || 0;
             fee.totalAmt = amount + lateFee + reAdmFee + penalty;
        }
    }
});

// --- Optional: Define the association explicitly here as well ---
// Although primarily defined in server.js, it can be helpful here for clarity
// or if using Sequelize CLI features.
// Student.hasMany(FeePayment, { foreignKey: 'student_id' });
// FeePayment.belongsTo(Student, { foreignKey: 'student_id' });

export default FeePayment;