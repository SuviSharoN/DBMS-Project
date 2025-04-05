import express from 'express';
import { addAcademics, addStudent, getAcademics } from '../Controllers/studentController.js';
const router = express.Router();

router.post('/' , addStudent );
router.post('/academics' , addAcademics);
router.get('/academics/:id' , getAcademics);

export default router;