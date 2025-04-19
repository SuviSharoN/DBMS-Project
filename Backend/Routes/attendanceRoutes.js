// Backend/Routes/attendanceRoutes.js
import express from 'express';
import {
    getStudentAttendanceSummary,
    getEnrolledStudentsForCourse,
    getAttendanceByCourseAndDate,
    markOrUpdateAttendance
    // REMOVED getMyCourses import
} from '../Controllers/attendanceController.js';

import { authMiddleware } from '../MiddleWare/authMiddleWare.js';
// --- Ensure isFaculty is correctly imported or defined ---
import { isFaculty } from '../MiddleWare/authMiddleWare.js'; // Assuming it's exported here
// OR define it locally if needed:
// const isFaculty = (req, res, next) => { /* ... check req.user.role ... */ };
// ---------------------------------------------------------

const router = express.Router();
console.log("Say hi");
router.get( '/student/summary', authMiddleware, getStudentAttendanceSummary );

router.get(
    '/faculty/course/:courseId/students',
    // REMOVED incorrect getMyCourses middleware usage
    authMiddleware, // Run auth first
    isFaculty,      // Run role check second
    getEnrolledStudentsForCourse // Run controller last
);

router.get(
    '/faculty/course/:courseId/date/:date',
    authMiddleware,
    isFaculty,
    getAttendanceByCourseAndDate
);

router.post(
    '/mark',
    authMiddleware,
    isFaculty,
    markOrUpdateAttendance
);

export default router;