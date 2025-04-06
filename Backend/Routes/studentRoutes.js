import express from 'express';
import { addAcademics, addStudent, getAcademics,getDashboard , addCredential , getCredential } from '../Controllers/studentController.js';
const router = express.Router();


router.post('/' , addStudent );
router.get('/dashboard/:id',getDashboard)
router.post('/academics' , addAcademics);
router.get('/academics/:id' , getAcademics);
router.post('/credentials' , addCredential);
router.get('/credentials/:id' , getCredential);
export default router;