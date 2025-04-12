// Backend/Controllers/offeringController.js
import facultyCourse from '../Models/facultyCoursesModel.js'; // The Offering model
import Course from '../Models/courseModel.js';
import Faculty from '../Models/facultyModel.js';
import Enrollment from '../Models/enrollmentModel.js'; // For checking before delete
import sequelize from '../Configuration/dbConnect.js'; // For transaction

// GET /api/offerings - Fetch all offerings with details
export const getAllOfferings = async (req, res) => {
    try {
        const offerings = await facultyCourse.findAll({
            include: [ // Use include to join tables based on associations set in server.js
                {
                    model: Course, // Model to include
                    attributes: ['id', 'course_name', 'credits'], // Specify needed attributes
                    required: true // INNER JOIN - only show offerings with valid courses
                },
                {
                    model: Faculty, // Model to include
                    attributes: ['id', 'name'], // Specify needed attributes
                    required: true // INNER JOIN - only show offerings with valid faculty
                }
            ],
            order: [
                // Order by course name, then faculty name
                [Course, 'course_name', 'ASC'], // Need to specify model for included sort
                [Faculty, 'name', 'ASC']
            ],
            attributes: ['id'] // Get the facultyCourse primary key itself
        });

        // Manually structure the response if include 'as' isn't working without index.js
         const structuredOfferings = offerings.map(offering => ({
              id: offering.id, // facultyCourse.id
              course: {
                  id: offering.Course.id, // Access included model directly
                  course_name: offering.Course.course_name,
                  credits: offering.Course.credits
              },
              faculty: {
                  id: offering.Faculty.id, // Access included model directly
                  name: offering.Faculty.name
              }
          }));


        res.status(200).json({ success: true, data: structuredOfferings }); // Send structured data
    } catch (error) {
        console.error("Error fetching offerings:", error);
        res.status(500).json({ success: false, message: 'Failed to retrieve offerings.', error: error.message });
    }
};

// DELETE /api/offerings/:id - Delete a specific offering link
export const deleteOffering = async (req, res) => {
    const { id } = req.params; // This is the facultyCourse ID
    const transaction = await sequelize.transaction();
    try {
        const offering = await facultyCourse.findByPk(id, { transaction });
        if (!offering) {
            await transaction.rollback();
            return res.status(404).json({ success: false, message: 'Offering link not found.' });
        }

        // Check for existing enrollments
        const enrollmentCount = await Enrollment.count({
            where: { faculty_course_id: id },
            transaction
        });
        if (enrollmentCount > 0) {
            await transaction.rollback();
            return res.status(409).json({ success: false, message: `Cannot remove offering: ${enrollmentCount} student(s) are enrolled.` });
        }

        await offering.destroy({ transaction });
        await transaction.commit();
        res.status(200).json({ success: true, message: 'Offering removed successfully.' });
    } catch (error) {
        await transaction.rollback();
        console.error(`Error deleting offering ${id}:`, error);
        res.status(500).json({ success: false, message: 'Failed to remove offering.', error: error.message });
    }
};