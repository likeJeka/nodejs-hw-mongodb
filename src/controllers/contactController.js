import Contact from '../models/contactModel.js';
import createError from 'http-errors';
import { addContact, updateContact, removeContact } from '../services/contacts.js';

// Получение всех контактов
export const getContacts = async (req, res, next) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json({ status: 200, message: "Successfully found contacts!", data: contacts });
    } catch (error) {
        next(error);
    }
};

// Получение контакта по ID
export const getContactById = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const contact = await Contact.findById(contactId);
        if (!contact) throw createError(404, "Contact not found");
        res.status(200).json({ status: 200, message: `Successfully found contact with id ${contactId}!`, data: contact });
    } catch (error) {
        next(error);
    }
};

// Создание нового контакта
export const createContact = async (req, res, next) => {
    try {
        const { name, phoneNumber, email, isFavourite, contactType } = req.body;
        const contact = await addContact({ name, phoneNumber, email, isFavourite, contactType });
        res.status(201).json({
            status: 201,
            message: "Successfully created a contact!",
            data: contact
        });
    } catch (error) {
        next(error);
    }
};

// Обновление контакта по ID
export const updateContactById = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const updatedData = req.body;
        const contact = await updateContact(contactId, updatedData);
        if (!contact) throw createError(404, "Contact not found");
        res.status(200).json({
            status: 200,
            message: "Successfully patched a contact!",
            data: contact
        });
    } catch (error) {
        next(error);
    }
};

// Удаление контакта по ID
export const deleteContactById = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const contact = await removeContact(contactId);
        if (!contact) throw createError(404, "Contact not found");
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};
