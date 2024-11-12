import express from 'express';
import { getContacts, getContactById } from '../controllers/contactController.js';

const router = express.Router();

// Маршрут для получения всех контактов
router.get('/contacts', getContacts);

// Маршрут для получения контакта по ID
router.get('/contacts/:contactId', getContactById);

export default router;
