import express from 'express';
import * as contactController from '../controllers/contactController.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../middlewares/validateBody.js';
import isValidId from '../middlewares/isValidId.js';
import authenticate from '../middlewares/authenticate.js';
import upload from '../middlewares/upload.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contactSchemas.js';

const router = express.Router();

router.use(authenticate);

router.get('/', ctrlWrapper(contactController.getContacts));
router.get('/:contactId', isValidId, ctrlWrapper(contactController.getContactById));
router.post('/', upload.single('photo'), validateBody(createContactSchema), ctrlWrapper(contactController.createContact));
router.patch('/:contactId', isValidId, upload.single('photo'), validateBody(updateContactSchema), ctrlWrapper(contactController.updateContactById));
router.delete('/:contactId', isValidId, ctrlWrapper(contactController.deleteContactById));

export default router;
