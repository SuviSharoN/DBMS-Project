// Handles student course enrollment functionality
// Provides enrollment creation with validation and duplicate checking
import Enrollment from '../Models/enrollmentModel.js'; // Direct import
import facultyCourse from '../Models/facultyCoursesModel.js';
import sequelize from '../Configuration/dbConnect.js';
import { Op } from 'sequelize';

export const createEnrollments = async (req, res) => {
    const studentId = req.user?.id; // Assuming student ID is from token
    const { facultyCourseIds } = req.body;

    if (!studentId) return res.status(401).json({ success: false, message: 'Auth required.' });
    if (!Array.isArray(facultyCourseIds) || facultyCourseIds.length === 0) {
        return res.status(400).json({ success: false, message: 'facultyCourseIds array required.' });
    }

    const transaction = await sequelize.transaction();
    try {
        // Verify offerings exist
        const existingOfferingsCount = await facultyCourse.count({
            where: { id: facultyCourseIds }, transaction
        });
        if (existingOfferingsCount !== facultyCourseIds.length) {
            await transaction.rollback();
            return res.status(404).json({ success: false, message: `Invalid offering IDs provided.` });
        }

        // Check for duplicate enrollments
        const existingEnrollments = await Enrollment.findAll({
            where: {
                student_id: studentId,
                faculty_course_id: { [Op.in]: facultyCourseIds } // Correct FK name
            },
            attributes: ['faculty_course_id'], transaction
        });
        if (existingEnrollments.length > 0) {
            await transaction.rollback();
            const conflicts = existingEnrollments.map(e => `Offering ID ${e.faculty_course_id}`);
            return res.status(409).json({ success: false, message: 'Already enrolled.', conflicts });
        }

        // Create enrollments
        const enrollmentsToCreate = facultyCourseIds.map(fcId => ({
            student_id: studentId,
            faculty_course_id: fcId // Correct FK name
        }));
        await Enrollment.bulkCreate(enrollmentsToCreate, { transaction });

        await transaction.commit();
        res.status(201).json({ success: true, message: `Successfully enrolled.` });
    } catch (error) {
        await transaction.rollback();
        console.error("Enrollment creation error:", error);
        res.status(500).json({ success: false, message: 'Server error during enrollment.', error: error.message });
    }
};