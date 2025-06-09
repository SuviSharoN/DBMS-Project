// Handles course offering management endpoints
// Includes authentication and admin middleware for protected actions
import express from 'express';
import { getAllOfferings, deleteOffering } from '../Controllers/offeringController.js';
import { authMiddleware, adminMiddleware } from '../MiddleWare/authMiddleWare.js';
const router = express.Router();
router.get('/', authMiddleware, getAllOfferings);
router.delete('/:id', authMiddleware, adminMiddleware, deleteOffering);
export default router;