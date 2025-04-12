import express from 'express';
import { addFaculty, getFaculty, getFacultyDashboard } from '../Controllers/facultyController.js';
const router = express.Router();

router.post('/' , addFaculty);
router.get('/:id' , getFaculty);
router.get('/dashboard/:id' , getFacultyDashboard)
export default router;