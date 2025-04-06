import express from 'express';
import { addCourse, getCourse } from '../Controllers/courseController.js';
const router = express.Router();
router.post('/' , addCourse)
router.get('/:id' , getCourse);
export default router;