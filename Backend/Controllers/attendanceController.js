// Handles attendance management for both students and faculty
// Provides functionality for marking, updating, and retrieving attendance records
import Attendance from '../Models/attendanceModel.js';
import Enrollment from '../Models/enrollmentModel.js';
import Student from '../Models/studentModel.js';
import FacultyCourse from '../Models/facultyCoursesModel.js';
import Course from '../Models/courseModel.js';
import Faculty from '../Models/facultyModel.js';
// No sequelize import needed unless using explicit transactions somewhere else

// Helper Function
async function verifyFacultyCourseAccess(facultyId, courseId) {
    const offering = await FacultyCourse.findOne({
        where: { faculty_id: facultyId, course_id: courseId },
        attributes: ['id']
    });
    return offering;
}

// --- Student Function ---
export const getStudentAttendanceSummary = async (req, res) => {
    try {
        const studentId = req.user.id;
        const enrollments = await Enrollment.findAll({
            where: { student_id: studentId },
            include: [{
                model: FacultyCourse, required: true,
                include: [{ model: Course, required: true }]
            }]
        });

        if (!enrollments || enrollments.length === 0) return res.json([]);

        const summary = [];
        for (const enrollment of enrollments) {
            const facultyCourseId = enrollment.FacultyCourse.id;
            const courseDetails = enrollment.FacultyCourse.Course;

            // COUNT records for this student in this offering
            const totalClasses = await Attendance.count({
                where: { student_id: studentId, faculty_course_id: facultyCourseId }
            });
            const presentClasses = await Attendance.count({
                where: { student_id: studentId, faculty_course_id: facultyCourseId, status: 'Present' } // Or include 'Late' based on rules
            });
            const percentage = totalClasses > 0 ? ((presentClasses / totalClasses) * 100) : 0;

            summary.push({
                courseId: courseDetails.id,
                courseName: courseDetails.course_name,
                facultyCourseId: facultyCourseId,
                totalClasses: totalClasses,
                presentClasses: presentClasses,
                percentage: parseFloat(percentage.toFixed(1)),
            });
        }
        res.status(200).json(summary);
    } catch (error) {
        console.error("Error fetching student attendance summary:", error);
        res.status(500).json({ message: "Server error fetching attendance summary." });
    }
};

// --- Faculty Functions ---

// Get students enrolled in the specific course offering
export const getEnrolledStudentsForCourse = async (req, res) => {
    try {
        const facultyId = req.user.id;
        const { courseId } = req.params;

        const offering = await verifyFacultyCourseAccess(facultyId, courseId);
        if (!offering) return res.status(403).json({ message: "Not authorized." });
        const facultyCourseId = offering.id;

        const enrollments = await Enrollment.findAll({
            where: { faculty_course_id: facultyCourseId },
            include: [{ model: Student, attributes: ['id', 'name', 'email'] }] // Just student details
        });
        const students = enrollments.map(en => en.Student).filter(Boolean);
        res.status(200).json(students);
    } catch (error) {
        console.error("Error fetching enrolled students:", error);
        res.status(500).json({ message: "Server error fetching enrolled students." });
    }
};

// Get existing attendance records for a specific date
export const getAttendanceByCourseAndDate = async (req, res) => {
     try {
        const facultyId = req.user.id;
        const { courseId, date } = req.params; // date should be 'YYYY-MM-DD'

        const offering = await verifyFacultyCourseAccess(facultyId, courseId);
        if (!offering) return res.status(403).json({ message: "Not authorized." });
        const facultyCourseId = offering.id;

        const attendanceRecords = await Attendance.findAll({
            where: {
                faculty_course_id: facultyCourseId,
                date: date // Match exact date
            },
            // Include student info to know who the record belongs to
            // Or just return status and student_id if frontend already has student list
             include: [{ model: Student, attributes: ['id', 'name'] }]
            // attributes: ['student_id', 'status', 'id'] // Alternative: only return IDs/status
        });
        res.status(200).json(attendanceRecords);
     } catch (error)
     {
        console.error("Error fetching attendance records by date:", error);
        res.status(500).json({ message: "Server error fetching records." });
    }
};


// Mark or Update attendance for multiple students for a specific date
export const markOrUpdateAttendance = async (req, res) => {
    try {
        const facultyId = req.user.id; // Needed? Not stored in model, but good for logs/auth
        const { courseId, date, attendanceData } = req.body;
        // attendanceData: [{ studentId: 123, status: "Present" }, ...]
        // date: 'YYYY-MM-DD'

        const offering = await verifyFacultyCourseAccess(facultyId, courseId);
        if (!offering) return res.status(403).json({ message: "Not authorized." });
        const facultyCourseId = offering.id;

        if (!Array.isArray(attendanceData) || attendanceData.length === 0 || !date) {
            return res.status(400).json({ message: "Invalid input data." });
        }

        // Prepare records for bulkCreate
        const recordsToProcess = attendanceData.map(record => ({
            student_id: record.studentId,
            faculty_course_id: facultyCourseId,
            date: date,
            status: record.status
        }));

        // Use bulkCreate with updateOnDuplicate
        const result = await Attendance.bulkCreate(recordsToProcess, {
            updateOnDuplicate: ["status", "updatedAt"] // Update status if record exists
        });

        res.status(201).json({ message: "Attendance marked successfully.", data: result });

    } catch (error) {
        console.error("Error marking attendance:", error);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
             return res.status(400).json({ message: "Error marking attendance. Check input data/duplicates.", error: error.errors ? error.errors.map(e=>e.message) : error.message });
        }
        res.status(500).json({ message: "Server error marking attendance." });
    }
};
