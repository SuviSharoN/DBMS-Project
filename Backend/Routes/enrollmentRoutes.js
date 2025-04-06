import express from 'express';
import { addEnrollment, getAllEnrollment } from '../Controllers/enrollmentController.js';

const router = express.Router();

router.post('/' , addEnrollment );

router.get('/' , getAllEnrollment);

export default router;