import Contact from '../models/contactModel.js';
import createError from 'http-errors';
import mongoose from 'mongoose'; // Для проверки и работы с ObjectId

// Получить все контакты
export const getContacts = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null; // Если авторизация используется
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const sortBy = req.query.sortBy || 'name';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
    const { type, isFavourite } = req.query;

    const filter = {};
    if (userId) filter.userId = userId; // Учитываем userId, если передан
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

// Получить контакт по ID
export const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      throw createError(400, 'Некорректный ID');
    }

    const contact = await Contact.findById(contactId).select('-__v');
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

// Создать новый контакт
export const createContact = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null; // Если используется авторизация
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;
    const photo = req.file ? req.file.path : null;

    const contactData = {
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
      photo,
    };

    if (userId) contactData.userId = userId;

    const contact = new Contact(contactData);
    await contact.save();

    res.status(201).json({
      status: 201,
      message: 'Контакт успешно создан!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// Обновить контакт по ID
export const updateContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      throw createError(400, 'Некорректный ID');
    }

    const updatedData = req.body;
    if (req.file) {
      updatedData.photo = req.file.path;
    }

    const contact = await Contact.findByIdAndUpdate(contactId, updatedData, { new: true });
    if (!contact) throw createError(404, 'Контакт не найден');

    res.status(200).json({
      status: 200,
      message: 'Контакт успешно обновлен!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// Удалить контакт по ID
export const deleteContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      throw createError(400, 'Некорректный ID');
    }

    const contact = await Contact.findByIdAndDelete(contactId);
    if (!contact) throw createError(404, 'Контакт не найден');

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
