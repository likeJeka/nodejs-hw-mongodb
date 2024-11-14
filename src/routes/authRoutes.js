import express from 'express';
import validateBody from '../middlewares/validateBody.js';
import * as authController from '../controllers/authController.js';
import { registerSchema, loginSchema } from '../validation/authSchemas.js';

const router = express.Router();

// Route for registering a new user
router.post('/register', validateBody(registerSchema), authController.register);

// Route for logging in an existing user
router.post('/login', validateBody(loginSchema), authController.login);

// Route for refreshing the session using refresh token from cookies
router.post('/refresh', authController.refreshSession);

// Route for logging out the user and deleting the session
router.post('/logout', authController.logout);

export default router;
