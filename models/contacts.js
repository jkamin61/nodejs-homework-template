const fs = require('fs/promises')
const path = require('node:path');
const crypto = require("crypto");

const generatedId = crypto.randomBytes(16).toString("hex");
const contactsPath = path.join(__dirname, 'contacts.json')
const listContacts = async () => {
    return fs.readFile(contactsPath).then((contacts) => {
        return JSON.parse(contacts);
    })
}

const getContactById = async (contactId) => {
    const contacts = await listContacts();
    const [contact] = contacts.filter(el => el.id === contactId);
    return contact;
}

const removeContact = async (contactId) => {
    try {
        const contactsData = await fs.readFile(contactsPath);
        const contacts = JSON.parse(contactsData);

        const contactToBeRemovedIndex = contacts.findIndex(item => item.id === contactId);

        if (contactToBeRemovedIndex !== -1) {
            contacts.splice(contactToBeRemovedIndex, 1);

            await fs.writeFile(contactsPath, JSON.stringify(contacts));
            console.log('Contact removed successfully.');
        } else {
            console.log('Contact not found.');
        }
    } catch (error) {
        console.error('Error removing contact:', error);
    }
}

const addContact = async (body) => {

    const contacts = await fs.readFile(contactsPath)
        .then((data) => JSON.parse(data))
        .then((contacts) => {
            body = {id: generatedId, ...body}
            return [...contacts, body];
        })
    await fs.writeFile(contactsPath, JSON.stringify(contacts));
    return body;
}

const updateContact = async (contactId, body) => {
    try {
        const contactsData = await fs.readFile(contactsPath);
        const contacts = JSON.parse(contactsData);
        const {name, email, phone} = body;
        const contactToBeUpdated = contacts.findIndex(item => item.id === contactId);
        contacts[contactToBeUpdated].name = name;
        contacts[contactToBeUpdated].email= email;
        contacts[contactToBeUpdated].phone = phone;

        await fs.writeFile(contactsPath, JSON.stringify(contacts));
    } catch (error) {
        console.error('Error updating contact:', error);
    }
}

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
}