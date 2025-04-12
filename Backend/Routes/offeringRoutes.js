import express from 'express';
import { getAllOfferings, deleteOffering } from '../Controllers/offeringController.js';
import { authMiddleware, adminMiddleware } from '../MiddleWare/authMiddleWare.js'; // Correct path
const router = express.Router();
router.get('/', authMiddleware, getAllOfferings);
router.delete('/:id', authMiddleware, adminMiddleware, deleteOffering);
export default router;