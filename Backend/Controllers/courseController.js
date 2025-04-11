// Backend/Controllers/courseController.js
import Course from '../Models/courseModel.js';

// Add a new course (Admin only)
export const addCourse = async (req, res) => {
    try {
        // Admin check is done by middleware now
        const { id, course_name, credits } = req.body;
        if (!id || !course_name || credits === undefined || credits === null) { // Check credits properly
             return res.status(400).json({ success: false, message: "Please provide id, course_name, and credits" });
        }
         const parsedCredits = parseInt(credits, 10);
         if (isNaN(parsedCredits) || parsedCredits < 0) {
              return res.status(400).json({ success: false, message: "Invalid credits value" });
         }

        // Check if course ID already exists
        const existingCourse = await Course.findOne({ where: { id } });
        if (existingCourse) {
            return res.status(409).json({ success: false, message: `Course with ID ${id} already exists.` });
        }

        const newCourse = await Course.create({ id, course_name, credits: parsedCredits });
        console.log("Course added:", newCourse.id);
        res.status(201).json({ success: true, message: "Course added successfully", data: newCourse }); // Use 201 Created
    } catch (error) {
        console.error("Error in inserting course record:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Get ALL available courses (Any logged-in user)
export const getAllCourses = async (req, res) => { // Renamed from getCourse
    try {
        // Authentication check is done by middleware
        const courses = await Course.findAll({
            order: [['course_name', 'ASC']] // Optional: order courses by name
        });

        if (!courses || courses.length === 0) {
            console.log("getAllCourses: No courses found in DB");
           // Return empty array, not an error, if DB is empty
           return res.status(200).json({ success: true, data: [] });
        }
        console.log(`getAllCourses: Fetched ${courses.length} courses`);
        res.status(200).json({ success: true, data: courses });
    } catch (error) {
        console.error("Error in fetching course records:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Delete a course (Admin only)
export const deleteCourse = async (req, res) => {
    try {
         // Admin check is done by middleware now
        const { id } = req.params; // Get ID from URL parameter

        if (!id) {
            return res.status(400).json({ success: false, message: "Course ID is required" });
        }

        const course = await Course.findOne({ where: { id: id } });

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        await Course.destroy({ where: { id: id } });
        console.log("Course deleted:", id);
        res.status(200).json({ success: true, message: "Course deleted successfully" });
        // Or use 204 No Content status
        // res.status(204).send();

    } catch (error) {
        console.error("Error deleting course:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};