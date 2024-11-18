import Contact from '../models/contactModel.js';
import createError from 'http-errors';
import {
  addContact,
  updateContact,
  removeContact,
} from '../services/contacts.js';

export const getContacts = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const sortBy = req.query.sortBy || 'name';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
    const { type, isFavourite } = req.query;

    const filter = { userId };
    if (type) filter.contactType = type;
    if (isFavourite) filter.isFavourite = isFavourite === 'true';

    // Логируем запрос
    console.log('Filter:', filter);
    console.log('Pagination:', { page, perPage });

    const totalItems = await Contact.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / perPage);
    const contacts = await Contact.find(filter)
      .select('-__v')
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder });

    res.status(200).json({
      status: 200,
      message: 'Контакты успешно найдены!',
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
    const userId = req.user._id;

    // Логируем ID контакта и ID пользователя
    console.log('Fetching contact with ID:', contactId, 'for user:', userId);

    const contact = await Contact.findOne({ _id: contactId, userId }).select('-__v');
    if (!contact) throw createError(404, 'Контакт не найден');

    res.status(200).json({
      status: 200,
      message: `Контакт с id ${contactId} успешно найден!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;
    const updatedData = req.body;

    // Логируем данные перед обновлением
    console.log('Updating contact with ID:', contactId);
    console.log('User ID:', userId);
    console.log('Updated Data:', updatedData);

    if (req.file) {
      updatedData.photo = req.file.path;
    }

    // Логируем перед обновлением
    console.log('Updated contact data:', updatedData);

    const contact = await updateContact(contactId, userId, updatedData);
    if (!contact) throw createError(404, 'Контакт не найден');

    const updatedContact = await Contact.findById(contactId).select('-__v');

    res.status(200).json({
      status: 200,
      message: 'Контакт успешно обновлен!',
      data: updatedContact,
    });
  } catch (error) {
    console.error('[updateContactById] Error:', error.message);
    next(error);
  }
};

export const deleteContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;

    // Логируем перед удалением
    console.log('Deleting contact with ID:', contactId, 'for user:', userId);

    const contact = await removeContact(contactId, userId);
    if (!contact) throw createError(404, 'Контакт не найден');

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
