// Backend/Controllers/enrollmentController.js
import Enrollment from '../Models/enrollmentModel.js';
import Course from '../Models/courseModel.js'; // To verify courses exist (optional but recommended)
import sequelize from '../Configuration/dbConnect.js'; // For transactions

// Controller to handle batch enrollment for the logged-in student
export const addEnrollment = async (req, res) => {
    // Start a database transaction for atomicity
    const transaction = await sequelize.transaction();
    
    try {
        // 1. Get authenticated student ID from req.user (set by authMiddleware/studentMiddleware)
        // This is more secure than trusting the request body.
        const studentId = req.user.id;
        if (!studentId) {
            // Should be caught by middleware, but good practice to check
            await transaction.rollback();
            return res.status(401).json({ success: false, message: "Authentication error: Student ID not found in token." });
        }

        // 2. Get course IDs array from request body
        const { courseIds } = req.body;

        // 3. Validate Input
        if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
            await transaction.rollback();
            return res.status(400).json({ success: false, message: "Invalid input: 'courseIds' must be a non-empty array." });
        }

        // 4. Optional but Recommended: Verify all submitted courses actually exist
        const existingCourses = await Course.findAll({
            where: { id: courseIds }, // Check if courses with these IDs exist
            attributes: ['id'],      // Only need the IDs
            transaction              // Include in transaction
        });
        const existingCourseIdsSet = new Set(existingCourses.map(c => c.id));
        const invalidCourseIds = courseIds.filter(id => !existingCourseIdsSet.has(id));

        if (invalidCourseIds.length > 0) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: `Invalid course IDs provided: ${invalidCourseIds.join(', ')}. Cannot enroll.`
            });
        }

        // 5. Prepare data for bulk creation or findOrCreate within the transaction
        const enrollmentData = courseIds.map(courseId => ({
            student_id: studentId,
            course_id: courseId,
            // status: 'enrolled', // You can set default status here or rely on DB default
            // faculty_id is NOT included here, assuming it's not part of the enrollment record itself
        }));

        // 6. Use bulkCreate with ignoreDuplicates or iterate with findOrCreate
        // Option A: bulkCreate (potentially faster, might throw unique constraint error if student is already enrolled)
        // try {
        //     await Enrollment.bulkCreate(enrollmentData, {
        //         transaction,
        //         // ignoreDuplicates: true, // Use if your DB supports it and you just want to ignore existing ones
        //         // Or handle potential unique constraint errors in the main catch block
        //     });
        // } catch (bulkError) {
        //     if (bulkError.name === 'SequelizeUniqueConstraintError') {
        //         // Handle gracefully if needed, or let the main catch block handle it
        //         console.warn(`Bulk enrollment conflict for student ${studentId}. Some courses might already be enrolled.`);
        //         // Depending on desired behavior, you might continue or rollback here
        //     } else {
        //         throw bulkError; // Re-throw other errors
        //     }
        // }

        // Option B: Iterate with findOrCreate (safer for handling existing enrollments individually)
        const results = [];
        for (const data of enrollmentData) {
            const [enrollment, created] = await Enrollment.findOrCreate({
                where: { student_id: data.student_id, course_id: data.course_id },
                defaults: data, // Use the prepared data if creating new
                transaction
            });
            results.push({ enrollment, created }); // Store result
        }
        const newlyCreatedCount = results.filter(r => r.created).length;
        const alreadyEnrolledCount = results.length - newlyCreatedCount;


        // 7. Commit the transaction
        await transaction.commit();

        console.log(`Enrollment processed for student ${studentId}. New: ${newlyCreatedCount}, Already enrolled: ${alreadyEnrolledCount}`);
        res.status(201).json({ // 201 Created status
            success: true,
            // Provide a clear message based on findOrCreate results
            message: `Enrollment successful! ${newlyCreatedCount} new course(s) added.${alreadyEnrolledCount > 0 ? ` ${alreadyEnrolledCount} course(s) were already enrolled.` : ''}`,
            data: { // Optional: return info about what was enrolled
                processedCourses: courseIds,
                newlyEnrolledCount: newlyCreatedCount,
            }
        });

    } catch (error) {
        // 8. Rollback transaction on any error
        await transaction.rollback();
        console.error("Enrollment creation error for student:", req.user?.id, error);

        // Handle specific errors if needed (like unique constraint if not using findOrCreate properly)
         if (error.name === 'SequelizeUniqueConstraintError') {
              return res.status(409).json({ // 409 Conflict
                  success: false,
                  message: "Enrollment conflict: You are likely already enrolled in one or more of these courses."
              });
         }

        // Generic server error for other issues
        res.status(500).json({ success: false, message: "Server error during the enrollment process." });
    }
};

// Keep your getAllEnrollment function as is, or modify if needed
export const getAllEnrollment = async (req, res) =>{
    try {
        const record = await Enrollment.findAll({}); // Maybe add filtering/pagination later
        if (!record || record.length === 0) {
             return res.status(200).json({ success: true, message: "No enrollment records found.", data: [] }); // Return empty array for no records
        }
        res.status(200).json({success : true , data : record});
    } catch (error) {
        console.log('Error in fetching Enrollment records', error);
        res.status(500).json({success : false , message : 'Server Error while fetching enrollments.'});
    }
};