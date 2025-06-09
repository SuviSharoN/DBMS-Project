// Backend/Routes/feeRoutes.js
import express from 'express';
import path from 'path';
import fs from 'fs';
import PDFDocument from 'pdfkit'; // Import pdfkit
import { fileURLToPath } from 'url';

import FeePayment from '../Models/FeePaymentModel.js';
 // Needed to get student email (optional)
 import Student from '../Models/studentModel.js'; 
// --- Calculate __dirname & Define Paths ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DOCUMENTS_PATH = path.resolve(__dirname, '..', 'uploads', 'fee_documents');
import { authMiddleware,isStudent } from '../MiddleWare/authMiddleWare.js';
// --- Ensure Receipt Directory Exists ---
if (!fs.existsSync(DOCUMENTS_PATH)) {
    console.log(`[Fee Routes] Creating directory: ${DOCUMENTS_PATH}`);
    fs.mkdirSync(DOCUMENTS_PATH, { recursive: true });
}

const router = express.Router();

// Generate fee document
function generateFeeDocument(student, fee) {
    return new Promise((resolve, reject) => {
        const filename = `fee_${student.id}_${Date.now()}.pdf`;
        const filePath = path.join(DOCUMENTS_PATH, filename);
        const doc = new PDFDocument({ margin: 50 });
        const writeStream = fs.createWriteStream(filePath);

        doc.pipe(writeStream);

        // Add content to PDF
        doc.fontSize(20).text('Fee Payment Document', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Student Name: ${student.name}`);
        doc.text(`Student ID: ${student.id}`);
        doc.text(`Description: ${fee.description}`);
        doc.text(`Amount: ₹${fee.amount}`);
        doc.text(`Due Date: ${fee.dueDate}`);
        doc.moveDown();
        doc.text('Please pay the above amount before the due date.', { align: 'center' });

        doc.end();

        writeStream.on('finish', () => resolve(filename));
        writeStream.on('error', reject);
    });
}

// --- GET /api/fees - Fetch Fee Details for Logged-in Student ---
router.get('/', authMiddleware,isStudent, async (req, res) => {
    const studentId = req.user.id; // Get student ID from authenticated request
    console.log(`[${studentId} Role: ${req.user.role}] GET /api/fees - Fetching fee details`);

    if (req.user.role !== 'Student') {
        return res.status(403).json({ success: false, message: 'Access denied. Only students can view their fees.' });
    }

    try {
        const fees = await FeePayment.findAll({
            where: { student_id: studentId },
            order: [['dueDate', 'DESC']], // Order by due date descending
        });
        res.status(200).json(fees);
    } catch (error) {
        console.error(`Error fetching fees for student ${studentId}:`, error);
        res.status(500).json({ success: false, message: 'Failed to fetch fee details.' });
    }
});

// Get all fees for a student
router.get('/student', authMiddleware, async (req, res) => {
    try {
        // If user is admin, they can view any student's fees
        // If user is student, they can only view their own fees
        const whereClause = req.user.role === 'Admin' ? {} : { student_id: req.user.id };
        
        const fees = await FeePayment.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
            include: [{
                model: Student,
                attributes: ['name', 'email']
            }]
        });
        res.json(fees);
    } catch (error) {
        console.error('Error fetching fees:', error);
        res.status(500).json({ message: 'Error fetching fees' });
    }
});

// Generate and get fee document
router.get('/document/:feeId', authMiddleware, async (req, res) => {
    try {
        const whereClause = req.user.role === 'Admin' 
            ? { id: req.params.feeId }
            : { id: req.params.feeId, student_id: req.user.id };

        const fee = await FeePayment.findOne({
            where: whereClause
        });

        if (!fee) {
            return res.status(404).json({ message: 'Fee not found' });
        }

        const student = await Student.findByPk(fee.student_id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Generate document if it doesn't exist
        if (!fee.documentUrl) {
            const filename = await generateFeeDocument(student, fee);
            fee.documentUrl = filename;
            await fee.save();
        }

        const filePath = path.join(DOCUMENTS_PATH, fee.documentUrl);
        res.download(filePath);
    } catch (error) {
        console.error('Error generating fee document:', error);
        res.status(500).json({ message: 'Error generating fee document' });
    }
});

// Process payment
router.post('/pay/:feeId', authMiddleware, isStudent, async (req, res) => {
    try {
        const fee = await FeePayment.findOne({
            where: { id: req.params.feeId, student_id: req.user.id }
        });

        if (!fee) {
            return res.status(404).json({ message: 'Fee not found' });
        }

        if (fee.status === 'Paid') {
            return res.status(400).json({ message: 'Fee already paid' });
        }

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        fee.status = 'Paid';
        await fee.save();

        res.json({ message: 'Payment successful', fee });
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ message: 'Error processing payment' });
    }
});

// --- GET /api/fees/receipt/:filename - Download Fee Receipt ---
router.get('/receipt/:filename', authMiddleware, async (req, res) => {
    const requestedFilename = req.params.filename;
    const userId = req.userId;
    const userRole = req.userRole;

    console.log(`[${userId} Role: ${userRole}] GET /api/fees/receipt/${requestedFilename}`);

    // --- Security Checks ---
    if (!requestedFilename || requestedFilename.includes('..') || requestedFilename.includes('/') || requestedFilename.includes('\\')) {
        console.warn(`Receipt download security violation: Invalid filename format '${requestedFilename}'`);
        return res.status(400).send('Invalid filename.');
    }

    const absoluteFilePath = path.join(DOCUMENTS_PATH, requestedFilename);

    // Extra check: Ensure the resolved path is within the storage directory
    if (!absoluteFilePath.startsWith(DOCUMENTS_PATH)) {
         console.warn(`Receipt download security violation: Path traversal attempt for '${requestedFilename}' -> resolved to '${absoluteFilePath}'`);
         return res.status(400).send('Invalid filename (path traversal attempt).');
    }

    try {
        // --- Authorization Check: Ensure file belongs to user or user is Admin ---
        const feeRecord = await FeePayment.findOne({
            where: { documentUrl: requestedFilename }
        });

        if (!feeRecord) {
             console.log(`Receipt file record not found in DB for filename: ${requestedFilename}`);
             return res.status(404).send('Receipt record not found.');
        }

        // Allow download if the fee belongs to the logged-in student OR if the user is an Admin
        if (feeRecord.student_id !== userId && userRole !== 'Admin') {
             console.warn(`Unauthorized receipt download attempt: User ${userId} tried to download receipt ${requestedFilename} belonging to student ${feeRecord.student_id}`);
             return res.status(403).send('Forbidden: You do not have permission to download this receipt.');
        }

        // --- Check if file exists on disk and serve ---
         fs.access(absoluteFilePath, fs.constants.R_OK, (err) => {
            if (err) {
                console.error(`Receipt file not found or not readable on disk: ${absoluteFilePath}`);
                // Even if DB record exists, file might be missing
                return res.status(404).send('Receipt file not found on server.');
            }

            // Use res.download()
            res.download(absoluteFilePath, requestedFilename, (downloadErr) => {
                if (downloadErr) {
                    console.error(`Error sending receipt file ${requestedFilename}:`, downloadErr);
                    if (!res.headersSent) {
                       res.status(500).send('Error downloading receipt.');
                    }
                } else {
                    console.log(`Successfully initiated receipt download for: ${requestedFilename}`);
                }
            });
        });

    } catch(dbError) {
         console.error(`Database error checking receipt ownership for ${requestedFilename}:`, dbError);
         res.status(500).send('Server error checking receipt details.');
    }
});

// Add sample fees for testing
router.post('/add-sample-fees', authMiddleware, async (req, res) => {
    // Only allow admins to add sample fees
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Only administrators can add sample fees' });
    }

    try {
        const studentId = req.body.studentId; // Get student ID from request body
        
        if (!studentId) {
            return res.status(400).json({ message: 'Student ID is required' });
        }

        // Verify student exists
        const student = await Student.findByPk(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Check if fees already exist for this student
        const existingFees = await FeePayment.findAll({
            where: { student_id: studentId }
        });

        if (existingFees.length > 0) {
            return res.status(400).json({ 
                message: 'Fees already exist for this student. Please clear existing fees first.' 
            });
        }
        
        // Sample fee records
        const sampleFees = [
            {
                student_id: studentId,
                description: 'Tuition Fee - Semester 1',
                amount: 50000.00,
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                status: 'Pending'
            },
            {
                student_id: studentId,
                description: 'Library Fee',
                amount: 2000.00,
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
                status: 'Pending'
            },
            {
                student_id: studentId,
                description: 'Laboratory Fee',
                amount: 3000.00,
                dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
                status: 'Pending'
            },
            {
                student_id: studentId,
                description: 'Sports Fee',
                amount: 1500.00,
                dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
                status: 'Pending'
            }
        ];

        // Create the fee records
        const createdFees = await FeePayment.bulkCreate(sampleFees);
        
        res.status(201).json({
            message: 'Sample fees added successfully',
            fees: createdFees
        });
    } catch (error) {
        console.error('Error adding sample fees:', error);
        res.status(500).json({ message: 'Error adding sample fees' });
    }
});

// Add a new route to clear fees for a student (admin only)
router.delete('/clear-fees/:studentId', authMiddleware, async (req, res) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Only administrators can clear fees' });
    }

    try {
        const studentId = req.params.studentId;
        
        // Verify student exists
        const student = await Student.findByPk(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Delete all fees for the student
        await FeePayment.destroy({
            where: { student_id: studentId }
        });

        res.json({ message: 'Fees cleared successfully' });
    } catch (error) {
        console.error('Error clearing fees:', error);
        res.status(500).json({ message: 'Error clearing fees' });
    }
});

export default router;