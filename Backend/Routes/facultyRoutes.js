import express from 'express';
import { getAllFaculties,getFaculty /* other handlers */,addFaculty, getFacultyDashboard } from '../Controllers/facultyController.js'; // Need facultyController
import { authMiddleware, adminMiddleware, isFaculty } from '../MiddleWare/authMiddleWare.js';
import { getMyCourses } from '../Controllers/facultyController.js';
const router = express.Router();
router.get('/mycourses',authMiddleware,isFaculty,getMyCourses)
console.log("--- facultyRoutes.js loaded ---");
router.get('/',getAllFaculties)
router.get('/:id', authMiddleware, adminMiddleware, getFaculty); 
router.get('/dashboard/:id',getFacultyDashboard)
router.post('/',addFaculty);

// Add POST, DELETE etc. if needed
export default router;