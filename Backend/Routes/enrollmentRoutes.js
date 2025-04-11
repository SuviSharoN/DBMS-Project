import express from 'express';
import { addEnrollment, getAllEnrollment } from '../Controllers/enrollmentController.js';
import { authMiddleware } from '../MiddleWare/authMiddleWare.js';
const router = express.Router();

router.post('/' , authMiddleware,addEnrollment );

router.get('/' , getAllEnrollment);

export default router;