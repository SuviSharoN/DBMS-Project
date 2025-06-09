// Handles course management endpoints (add, get, delete)
// Uses authentication and admin middleware for protected actions
import express from 'express';
import { addCourse, getAllCourses, deleteCourse } from '../Controllers/courseController.js';
// Import middleware
import { authMiddleware, adminMiddleware } from '../MiddleWare/authMiddleWare.js';

const router = express.Router();

// Add a new course - Requires login AND Admin role
router.post('/', authMiddleware, adminMiddleware, addCourse);

// Get all courses - Requires login (any role)
router.get('/', authMiddleware, getAllCourses); // Changed route and controller

// Delete a course - Requires login AND Admin role
router.delete('/:id', authMiddleware, adminMiddleware, deleteCourse); // Added :id param

// Remove or comment out the old GET route if it existed
// router.get('/:id' , getCourse); // REMOVE THIS

export default router;