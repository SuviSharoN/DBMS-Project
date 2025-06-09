// Handles faculty-course assignment and management
// Provides functionality to create and manage course offerings by faculty
import FacultyCourse from '../Models/facultyCoursesModel.js'; // Direct import
import Course from '../Models/courseModel.js';
import Faculty from '../Models/facultyModel.js';
import sequelize from '../Configuration/dbConnect.js';

// POST /api/facultycourses (Admin creates link)
export const addFacultyCourses = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { faculty_id, course_id } = req.body;
        if (!faculty_id || !course_id) {
             await transaction.rollback();
            return res.status(400).json({ success: false, message: "Please provide faculty_id and course_id" });
        }
        const courseIdUpper = course_id.toUpperCase();

        // Verify course and faculty exist before creating link
        const courseExists = await Course.findByPk(courseIdUpper, { transaction });
        const facultyExists = await Faculty.findByPk(faculty_id, { transaction }); // Adjust type if faculty ID isn't integer

        if (!courseExists) {
             await transaction.rollback();
            return res.status(404).json({ success: false, message: `Course with ID ${courseIdUpper} not found.` });
        }
        if (!facultyExists) {
             await transaction.rollback();
            return res.status(404).json({ success: false, message: `Faculty with ID ${faculty_id} not found.` });
        }

        // Check if link already exists
        const existingLink = await FacultyCourse.findOne({
            where: { faculty_id: faculty_id, course_id: courseIdUpper },
            transaction
        });
        if(existingLink){
            await transaction.rollback();
            return res.status(409).json({ success: false, message: `This faculty is already linked to this course.` });
        }


        const newFacultyCourse = await FacultyCourse.create({
            faculty_id,
            course_id: courseIdUpper
        }, { transaction });

        await transaction.commit();
        res.status(201).json({ success: true, message: 'Offering link created.', data: newFacultyCourse });

    } catch (error) {
        await transaction.rollback();
        console.log("Error in inserting facultyCourse records ", error);
         if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(404).json({ success: false, message: 'Invalid Course ID or Faculty ID provided.' });
         }
         if (error.name === 'SequelizeUniqueConstraintError') {
              return res.status(409).json({ success: false, message: `This faculty is already linked to this course.` });
         }
        res.status(500).json({ success: false, message: "Server Error creating offering link.", error: error.message });
    }
};

// Removed getFacultyCourses as it's replaced by GET /api/offerings