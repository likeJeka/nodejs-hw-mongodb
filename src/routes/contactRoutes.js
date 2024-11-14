import express from 'express';
import * as contactController from '../controllers/contactController.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const router = express.Router();

router.get('/contacts', ctrlWrapper(contactController.getContacts));
router.get('/contacts/:contactId', ctrlWrapper(contactController.getContactById));
router.post('/contacts', ctrlWrapper(contactController.createContact));
router.patch('/contacts/:contactId', ctrlWrapper(contactController.updateContactById));
router.delete('/contacts/:contactId', ctrlWrapper(contactController.deleteContactById));

export default router;
