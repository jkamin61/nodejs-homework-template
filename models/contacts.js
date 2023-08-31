const Contact = require('../schemas/contact.model');

const listContacts = async () => {
    return Contact.find();
}
const getContactById = async (contactId) => {
    return Contact.findOne({_id: contactId});
}

const removeContact = async (contactId) => {
    Contact.deleteOne({_id: contactId});
}

const addContact = async (body) => {
    Contact.create(body);
}

const updateContact = async (contactId, body) => {
    await Contact.updateOne({_id: contactId}, body)
}

const updateStatusContact = async (contactId, body) => {
    await Contact.updateOne({_id: contactId}, {favorite: body})
}

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
    updateStatusContact,
}