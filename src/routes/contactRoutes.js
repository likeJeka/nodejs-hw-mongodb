import express from 'express';
import { getContacts, getContactById } from '../controllers/contactController.js';

const router = express.Router();

// Маршрут для получения всех контактов
router.get('/', getContacts);

// Маршрут для получения одного контакта по ID
router.get('/:contactId', getContactById);

export default router;
