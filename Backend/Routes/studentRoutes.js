import express from 'express';
import { addStudent, getAcademics,getDashboard,getCredential } from '../Controllers/studentController.js';
const router = express.Router();


router.post('/' , addStudent );
router.get('/dashboard/:id',getDashboard);
router.get('/academics/:id' , getAcademics);
export default router;