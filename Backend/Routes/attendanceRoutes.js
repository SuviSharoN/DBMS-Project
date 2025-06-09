// Handles attendance management endpoints for students and faculty
// Includes summary, marking, and retrieval of attendance records
import express from 'express';
import {
    getStudentAttendanceSummary,
    getEnrolledStudentsForCourse,
    getAttendanceByCourseAndDate,
    markOrUpdateAttendance
} from '../Controllers/attendanceController.js';
import { authMiddleware } from '../MiddleWare/authMiddleWare.js';
import { isFaculty } from '../MiddleWare/authMiddleWare.js';

const router = express.Router();

router.get('/student/summary', authMiddleware, getStudentAttendanceSummary);

router.get(
    '/faculty/course/:courseId/students',
    authMiddleware,
    isFaculty,
    getEnrolledStudentsForCourse
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