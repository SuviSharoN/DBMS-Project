import express from 'express';
import { addFaculty, getFaculty } from '../Controllers/facultyController.js';
const router = express.Router();

router.post('/' , addFaculty);
router.get('/:id' , getFaculty);

export default router;