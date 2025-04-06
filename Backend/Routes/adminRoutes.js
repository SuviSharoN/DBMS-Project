import express from 'express';
import { addAdmin , getAdmin } from '../Controllers/adminController.js';
const router = express.Router();

router.post('/' , addAdmin);
router.get('/:id' , getAdmin);

export default router;