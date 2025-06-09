// Handles faculty management and dashboard endpoints
// Provides routes for faculty CRUD and dashboard access
import express from 'express';
import { getAllFaculties, getFaculty, addFaculty, getFacultyDashboard } from '../Controllers/facultyController.js';
import { authMiddleware, adminMiddleware, isFaculty } from '../MiddleWare/authMiddleWare.js';
import { getMyCourses } from '../Controllers/facultyController.js';
const router = express.Router();
router.get('/mycourses', authMiddleware, isFaculty, getMyCourses);
router.get('/', getAllFaculties);
router.get('/:id', authMiddleware, adminMiddleware, getFaculty);
router.get('/dashboard/:id', getFacultyDashboard);
router.post('/', addFaculty);
export default router;