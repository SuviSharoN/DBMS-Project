// Handles authentication endpoints for login
// Validates user credentials and issues tokens
import express from 'express';
import  {validateLogin}  from '../Controllers/authenticationController.js';

const router = express.Router();

router.post('/login', validateLogin);

export default router;
