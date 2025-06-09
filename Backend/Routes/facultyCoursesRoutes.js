// Handles faculty course assignment endpoints
// Allows adding courses for faculty members
import express from 'express';
import { addFacultyCourses } from '../Controllers/facultyCourseController.js';

const router = express.Router();

router.post('/', addFacultyCourses);
// router.get('/:id' , getFacultyCourses);
export default router;