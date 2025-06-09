// Handles admin management and dashboard API endpoints
// Provides routes for adding, fetching, and dashboard access for admins
import express from 'express';
import { addAdmin, getAdmin, getAdminDashboard } from '../Controllers/adminController.js';
const router = express.Router();

router.post('/', addAdmin);
router.get('/:id', getAdmin);
router.get('/dashboard/:id', getAdminDashboard);

export default router;