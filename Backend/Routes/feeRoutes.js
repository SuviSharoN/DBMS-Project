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
const RECEIPT_STORAGE_PATH = path.resolve(__dirname, '..', 'uploads', 'receipts');
import { authMiddleware,isStudent } from '../MiddleWare/authMiddleWare.js';
// --- Ensure Receipt Directory Exists ---
if (!fs.existsSync(RECEIPT_STORAGE_PATH)) {
    console.log(`[Fee Routes] Creating directory: ${RECEIPT_STORAGE_PATH}`);
    fs.mkdirSync(RECEIPT_STORAGE_PATH, { recursive: true });
}

const router = express.Router();

// --- Helper: Generate Receipt PDF ---
// Returns a Promise that resolves when the PDF is written
function generateReceiptPDF(fee, filePath) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const writeStream = fs.createWriteStream(filePath);

        doc.pipe(writeStream);

        // --- PDF Content ---
        doc.fontSize(20).font('Helvetica-Bold').text('Payment Receipt', { align: 'center' });
        doc.moveDown(2);

        doc.fontSize(12).font('Helvetica');
        doc.text(`Fee ID: ${fee.id}`);
        doc.text(`Description: ${fee.description}`);
        doc.moveDown();

        doc.text(`Amount Paid: Rs. ${parseFloat(fee.totalAmt).toFixed(2)}`); // Use totalAmt
        doc.text(`Paid On: ${fee.paidOn}`); // Assumes paidOn is set before calling
        doc.text(`Status: ${fee.status}`);
        doc.moveDown();

        // Add more details if needed (student name, etc.)

        doc.end();

        writeStream.on('finish', resolve); // Resolve promise when writing is done
        writeStream.on('error', reject);   // Reject promise on error
    });
}

// --- Helper: Send Receipt Email (Placeholder) ---
async function sendReceiptEmail(studentEmail, feeDetails, receiptPath) {
    // --- Add your Nodemailer logic here ---
    // 1. Configure transporter (use env vars for credentials)
    // 2. Define mailOptions (to, subject, text, attachments)
    // 3. Call transporter.sendMail()
    console.log(`[Placeholder] Sending receipt email to ${studentEmail}`);
    console.log(`   Fee: ${feeDetails.description}, Amount: ${feeDetails.totalAmt}`);
    console.log(`   Attachment Path: ${receiptPath}`);
    // Example using nodemailer (install it first!)
    /*
    import nodemailer from 'nodemailer';
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail', // e.g., 'gmail'
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: studentEmail,
            subject: `Payment Receipt for ${feeDetails.description}`,
            text: `Dear Student,\n\nPlease find attached the receipt for your recent payment.\n\nDetails:\nFee: ${feeDetails.description}\nAmount: Rs. ${feeDetails.totalAmt}\nPaid On: ${feeDetails.paidOn}\n\nThank you.`,
            attachments: [{
                filename: path.basename(receiptPath),
                path: receiptPath,
                contentType: 'application/pdf'
            }]
        };
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: %s', info.messageId);
    } catch (error) {
        console.error("Error sending receipt email:", error);
        // Decide if payment process should fail if email fails
    }
    */
   return Promise.resolve(); // Simulate success for now
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

// --- POST /api/fees/pay/:feeId - Process Payment (Simulation) ---
router.post('/pay/:feeId', authMiddleware, async (req, res) => {
    const studentId = req.userId;
    const { feeId } = req.params;
    console.log(`[${studentId} Role: ${req.userRole}] POST /api/fees/pay/${feeId} - Processing payment`);

    if (req.userRole !== 'Student') {
        return res.status(403).json({ success: false, message: 'Access denied. Only students can pay fees.' });
    }

    try {
        // 1. Find the fee record for this student
        const fee = await FeePayment.findOne({
            where: { id: feeId, student_id: studentId }
        });

        if (!fee) {
            return res.status(404).json({ success: false, message: 'Fee record not found or does not belong to you.' });
        }

        if (fee.status === 'Paid') {
            return res.status(400).json({ success: false, message: 'This fee has already been paid.' });
        }

        // --- Simulate Payment Gateway Interaction Here (if applicable) ---
        // For now, we assume payment is successful

        // 2. Update Fee Status and Date
        fee.status = 'Paid';
        fee.paidOn = new Date().toISOString().split("T")[0]; // Today's date YYYY-MM-DD

        // 3. Generate and Save Receipt Filename
        const receiptFilename = `receipt_${fee.id}_${studentId}_${Date.now()}.pdf`;
        const receiptFilePath = path.join(RECEIPT_STORAGE_PATH, receiptFilename);
        fee.receiptFilename = receiptFilename; // Save filename to DB

        // 4. Generate the PDF
        await generateReceiptPDF(fee, receiptFilePath);
        console.log(`Generated receipt: ${receiptFilePath}`);

        // 5. Save updated fee record (including status, paidOn, receiptFilename)
        await fee.save();

        // 6. (Optional but recommended) Send Email Notification
        try {
            const student = await Student.findByPk(studentId, { attributes: ['email'] }); // Fetch student's email
            if (student && student.email) {
                await sendReceiptEmail(student.email, fee, receiptFilePath);
            } else {
                console.warn(`Could not find email for student ${studentId} to send receipt.`);
            }
        } catch (emailError) {
             console.error("Failed during email sending process:", emailError);
             // Don't fail the whole request just because email failed, but log it.
        }

        res.status(200).json({ success: true, message: 'Payment successful. Receipt generated.', fee }); // Send back updated fee

    } catch (error) {
        console.error(`Error processing payment for fee ${feeId}:`, error);
        res.status(500).json({ success: false, message: 'Payment processing failed.' });
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

    const absoluteFilePath = path.join(RECEIPT_STORAGE_PATH, requestedFilename);

    // Extra check: Ensure the resolved path is within the storage directory
    if (!absoluteFilePath.startsWith(RECEIPT_STORAGE_PATH)) {
         console.warn(`Receipt download security violation: Path traversal attempt for '${requestedFilename}' -> resolved to '${absoluteFilePath}'`);
         return res.status(400).send('Invalid filename (path traversal attempt).');
    }

    try {
        // --- Authorization Check: Ensure file belongs to user or user is Admin ---
        const feeRecord = await FeePayment.findOne({
            where: { receiptFilename: requestedFilename }
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

export default router;