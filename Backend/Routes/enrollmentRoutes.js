import express from 'express';
import { createEnrollments } from '../Controllers/enrollmentController.js';
import { authMiddleware } from '../MiddleWare/authMiddleWare.js';
const router = express.Router();

router.post('/' , authMiddleware,createEnrollments );



export default router;