import express from 'express';
import validateBody from '../middlewares/validateBody.js';
import * as authController from '../controllers/authController.js';
import { registerSchema, loginSchema, resetEmailSchema, resetPasswordSchema } from '../validation/authSchemas.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), authController.register);
router.post('/login', validateBody(loginSchema), authController.login);
router.post('/refresh', authController.refreshSession);
router.post('/logout', authController.logout);
router.post('/send-reset-email', validateBody(resetEmailSchema), authController.sendResetEmail);
router.post('/reset-pwd', validateBody(resetPasswordSchema), authController.resetPassword);

export default router;
