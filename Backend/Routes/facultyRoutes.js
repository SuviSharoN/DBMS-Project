import express from 'express';
import { getAllFaculties /* other handlers */ } from '../Controllers/facultyController.js'; // Need facultyController
import { authMiddleware, adminMiddleware } from '../MiddleWare/authMiddleWare.js';
const router = express.Router();
router.get('/', authMiddleware, adminMiddleware, getAllFaculties); // Fetch faculties for dropdown
// Add POST, DELETE etc. if needed
export default router;