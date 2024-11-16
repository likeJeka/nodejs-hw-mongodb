import Contact from '../models/contactModel.js';
import createError from 'http-errors';
import {
  addContact,
  updateContact,
  removeContact,
} from '../services/contacts.js';

export const getContacts = async (req, res, next) => {
  try {
    const userId = req.user._id; // Добавление фильтра по userId
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const sortBy = req.query.sortBy || 'name';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
    const { type, isFavourite } = req.query;

    const filter = { userId }; // Фильтр по userId для возврата только контактов текущего пользователя
    if (type) filter.contactType = type;
    if (isFavourite) filter.isFavourite = isFavourite === 'true';

    const totalItems = await Contact.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / perPage);
    const contacts = await Contact.find(filter)
      .select('-__v')
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder });

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data: contacts,
        page,
        perPage,
        totalItems,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id; // Проверка принадлежности контакта пользователю
    const contact = await Contact.findOne({ _id: contactId, userId }).select('-__v');
    if (!contact) throw createError(404, 'Contact not found');
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const userId = req.user._id; // Добавление userId при создании контакта
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;
    const contact = await addContact({
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
      userId,
    });
    const newContact = await Contact.findById(contact._id).select('-__v');
    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id; // Проверка принадлежности контакта пользователю
    const updatedData = req.body;
    const contact = await updateContact(contactId, userId, updatedData);
    if (!contact) throw createError(404, 'Contact not found');
    const updatedContact = await Contact.findById(contactId).select('-__v');
    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id; // Проверка принадлежности контакта пользователю
    const contact = await removeContact(contactId, userId);
    if (!contact) throw createError(404, 'Contact not found');
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
