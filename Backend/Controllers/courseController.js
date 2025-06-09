// Handles course management operations including creation, retrieval, and deletion
// Implements validation and dependency checks to maintain data integrity
import Course from '../Models/courseModel.js'; // Direct import
import facultyCourse from '../Models/facultyCoursesModel.js'; // Needed for check before delete
import sequelize from '../Configuration/dbConnect.js'; // For transaction maybe

// Add a new base course
export const addCourse = async (req, res) => {
    try {
        const { id, course_name, credits } = req.body;
        if (!id || !course_name || !credits) {
            return res.status(400).json({ success: false, message: 'Missing required course fields.' });
        }
        const courseIdUpper = id.toUpperCase();

        // Consider transaction if needed
        const existingCourse = await Course.findByPk(courseIdUpper);
        if(existingCourse){
            return res.status(409).json({ success: false, message: `Course with ID ${courseIdUpper} already exists.` });
        }

        const newCourse = await Course.create({
            id: courseIdUpper,
            course_name,
            credits: parseInt(credits) // Ensure credits is number
        });
        res.status(201).json({ success: true, message: 'Base course added successfully!', data: newCourse });
    } catch (error) {
        console.error("Error adding base course:", error);
         if (error.name === 'SequelizeValidationError') {
             return res.status(400).json({ success: false, message: "Validation Error", errors: error.errors.map(e => e.message) });
         }
         if (error.name === 'SequelizeUniqueConstraintError') {
              return res.status(409).json({ success: false, message: `Course with ID ${req.body.id?.toUpperCase()} already exists.` });
         }
        res.status(500).json({ success: false, message: 'Server Error adding course.', error: error.message });
    }
};

// Get all base courses
export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.findAll({ order: [['course_name', 'ASC']] });
        res.status(200).json({ success: true, data: courses });
    } catch (error) {
        console.error("Error fetching all courses:", error);
        res.status(500).json({ success: false, message: 'Server Error fetching courses.', error: error.message });
    }
};

// Delete a base course
export const deleteCourse = async (req, res) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction(); // Use transaction
    try {
        const course = await Course.findByPk(id.toUpperCase(), { transaction });
        if (!course) {
             await transaction.rollback();
            return res.status(404).json({ success: false, message: 'Base course not found.' });
        }

        // IMPORTANT Check: Prevent deletion if offerings exist
        const offeringCount = await facultyCourse.count({
            where: { course_id: id.toUpperCase() },
            transaction
        });

        if (offeringCount > 0) {
            await transaction.rollback();
            return res.status(409).json({ success: false, message: `Cannot delete course ${id.toUpperCase()}: ${offeringCount} offering(s) exist.` });
        }

        await course.destroy({ transaction });
        await transaction.commit();
        res.status(200).json({ success: true, message: `Base course ${id.toUpperCase()} deleted successfully.` });
    } catch (error) {
        await transaction.rollback();
        console.error(`Error deleting base course ${id}:`, error);
        res.status(500).json({ success: false, message: 'Server Error deleting course.', error: error.message });
    }
};