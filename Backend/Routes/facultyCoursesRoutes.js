import express from 'express';
import { addFacultyCourses, getFacultyCourses } from '../Controllers/facultyCourseController.js';

const router = express.Router();

router.post('/' , addFacultyCourses);
router.get('/:id' , getFacultyCourses);
export default router;