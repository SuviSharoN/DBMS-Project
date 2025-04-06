import express from 'express';
import { validateLogin } from '../Controllers/authenticationController.js';

const router = express.Router();

router.post('/login', validateLogin);

export default router;
