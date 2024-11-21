import Contact from '../models/contactModel.js';

export const getAllContacts = async () => {
    try {
        const contacts = await Contact.find(); 
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

export const updateContact = async (contactId, updatedData) => {
    try {
        return await Contact.findByIdAndUpdate(
            contactId, 
            updatedData,
            { new: true }
        );
    } catch (error) {
        throw new Error('Error updating contact');
    }
};

export const removeContact = async (contactId) => {
    try {
        return await Contact.findByIdAndDelete(contactId); 
    } catch (error) {
        throw new Error('Error deleting contact');
    }
};
