import express from 'express';
import validateBody from '../middlewares/validateBody.js';
import * as authController from '../controllers/authController.js';
import { registerSchema, loginSchema } from '../validation/authSchemas.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), authController.register);

router.post('/login', validateBody(loginSchema), authController.login);

router.post('/refresh', authController.refreshSession);

router.post('/logout', authController.logout);

export default router;
