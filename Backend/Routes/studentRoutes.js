import express from 'express';
import { addAcademics, addStudent, getAcademics,getDashboard,StudentValidation } from '../Controllers/studentController.js';
const router = express.Router();


router.post('/' , addStudent );
router.get('/dashboard/:id',getDashboard)
router.post('/academics' , addAcademics);
router.get('/academics/:id' , getAcademics);
router.post('/login',StudentValidation)
export default router;