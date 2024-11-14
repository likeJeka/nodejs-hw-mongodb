import Contact from '../models/contactModel.js';

export const getAllContacts = async (userId) => {
    try {
        const contacts = await Contact.find({ userId });
        return contacts;
    } catch (error) {
        throw new Error('Error fetching contacts');
    }
};

export const addContact = async (contactData) => {
    try {
        const contact = new Contact(contactData);
        return await contact.save();
    } catch (error) {
        throw new Error('Error creating contact');
    }
};

export const updateContact = async (contactId, updatedData, userId) => {
    try {
        return await Contact.findOneAndUpdate(
            { _id: contactId, userId },
            updatedData,
            { new: true }
        );
    } catch (error) {
        throw new Error('Error updating contact');
    }
};

export const removeContact = async (contactId, userId) => {
    try {
        return await Contact.findOneAndDelete({ _id: contactId, userId });
    } catch (error) {
        throw new Error('Error deleting contact');
    }
};
