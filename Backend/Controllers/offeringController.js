// Handles course offering management and retrieval
// Provides functionality to fetch all offerings with enrollment counts and delete offerings
import facultyCourse from '../Models/facultyCoursesModel.js'; // The Offering model (FacultyCourse)
import Course from '../Models/courseModel.js';
import Faculty from '../Models/facultyModel.js';
import Enrollment from '../Models/enrollmentModel.js';
import sequelize from '../Configuration/dbConnect.js';
import { Sequelize } from 'sequelize'; // <--- Import Sequelize for literal

// GET /api/offerings - Fetch all offerings with details
export const getAllOfferings = async (req, res) => {
    console.log("--- DEBUG: Executing getAllOfferings in offeringController (Corrected) ---");
    try {
        const offerings = await facultyCourse.findAll({
            // **** Step 1: Select required fields from facultyCourse including 'capacity' ****
            attributes: [
                'id',
                'capacity', // <<<====== SELECT CAPACITY HERE
                // Add calculated enrollmentCount
                [
                    Sequelize.literal(`(
                        SELECT COUNT(*)
                        FROM enrollments AS e
                        WHERE
                            e.faculty_course_id = facultyCourse.id
                    )`),
                    'enrollmentCount'
                ]
                // Add createdAt/updatedAt if needed: 'createdAt', 'updatedAt'
            ],
            include: [ // Still use include to join related tables
                {
                    model: Course,
                    attributes: ['id', 'course_name', 'credits'],
                    required: true // INNER JOIN
                },
                {
                    model: Faculty,
                    attributes: ['id', 'name'],
                    required: true // INNER JOIN
                }
            ],
            order: [ // Ordering might need adjustment if 'as' aliases aren't defined/used
                // Try ordering by included model directly (might work depending on Sequelize version)
                 [Course, 'course_name', 'ASC'],
                 [Faculty, 'name', 'ASC']
                // If the above fails, remove 'order' here and sort manually after mapping (Step 3)
            ],
            nest: true, // Helps structure included data if aliases work
            raw: false  // Get Sequelize instances to easily access included data and calculated fields
        });

        console.log("--- DEBUG: Raw Offerings from DB (offeringController) ---:", JSON.stringify(offerings, null, 2));

        // **** Step 2: Structure the response, ensuring capacity and counts are included ****
        const structuredOfferings = offerings.map(offering => {
            // Access included models. Try direct name first, fallback to alias if defined elsewhere.
            const courseData = offering.Course || offering.course || null;
            const facultyData = offering.Faculty || offering.faculty || null;
            // Use getDataValue for calculated fields like enrollmentCount
            const enrollmentCount = parseInt(offering.getDataValue('enrollmentCount') || '0', 10);
            // Access capacity directly from the offering instance
            const capacity = offering.capacity ?? 0;
            const availableSeats = Math.max(0, capacity - (isNaN(enrollmentCount) ? 0 : enrollmentCount));

            const result = {
                id: offering.id,
                capacity: capacity, // Include capacity
                enrollmentCount: isNaN(enrollmentCount) ? 0 : enrollmentCount, // Include count
                availableSeats: availableSeats, // Include calculated seats
                course: courseData ? {
                    id: courseData.id,
                    course_name: courseData.course_name,
                    credits: courseData.credits
                } : null,
                faculty: facultyData ? {
                    id: facultyData.id,
                    name: facultyData.name
                } : null
            };
            return result;

         }).filter(o => o.course && o.faculty); // Filter out items where includes might have failed


         // **** Step 3 (Optional): Manual sort if ordering in query failed ****
         // If the order clause in findAll didn't work reliably without 'as' aliases:
         /*
         structuredOfferings.sort((a, b) =>
             (a.course?.course_name ?? '').localeCompare(b.course?.course_name ?? '') ||
             (a.faculty?.name ?? '').localeCompare(b.faculty?.name ?? '')
         );
         */

        console.log("--- DEBUG: Sending Structured Offerings (offeringController) ---:", JSON.stringify(structuredOfferings, null, 2));
        res.status(200).json({ success: true, data: structuredOfferings });

    } catch (error) {
        console.error("Error fetching offerings (offeringController):", error);
        res.status(500).json({ success: false, message: 'Failed to retrieve offerings.', error: error.message });
    }
};

// --- (deleteOffering function remains the same) ---
export const deleteOffering = async (req, res) => {
    try {
        const offeringId = req.params.id;
        const deleted = await facultyCourse.destroy({
            where: { id: offeringId }
        });
        if (deleted) {
            res.status(200).json({ success: true, message: 'Offering deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Offering not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete offering', error: error.message });
    }
};