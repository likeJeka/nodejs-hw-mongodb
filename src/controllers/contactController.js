import Contact from '../models/contactModel.js';

// Контроллер для получения всех контактов
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find(); // Получаем все контакты из базы данных
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Server error',
    });
  }
};

// Контроллер для получения одного контакта по ID
export const getContactById = async (req, res) => {
  try {
    const { contactId } = req.params;

    const contact = await Contact.findById(contactId); // Ищем контакт по ID

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Server error',
    });
  }
};
