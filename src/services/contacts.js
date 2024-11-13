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
    await contact.save();
    return contact;
  } catch (error) {
    throw new Error('Error creating contact');
  }
};

export const updateContact = async (contactId, updatedData) => {
  try {
    const contact = await Contact.findByIdAndUpdate(contactId, updatedData, {
      new: true,
    });
    return contact;
  } catch (error) {
    throw new Error('Error updating contact');
  }
};

export const removeContact = async (contactId) => {
  try {
    const contact = await Contact.findByIdAndDelete(contactId);
    return contact;
  } catch (error) {
    throw new Error('Error deleting contact');
  }
};
