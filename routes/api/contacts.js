const express = require('express')
const Joi = require('joi');
const {
    listContacts,
    getContactById,
    addContact,
    removeContact,
    updateContact,
    updateStatusContact,
} = require("../../models/contacts");
const router = express.Router()

const postContactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
});
const putContactSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string(),
});

router.get('/', async (req, res, next) => {
    try {
        const contacts = await listContacts();
        res.json({
            status: 'success',
            code: 200,
            data: {
                contacts,
            }
        })
    } catch (err) {
        next(err);
    }
})

router.get('/:contactId', async (req, res, next) => {
    try {
        const {contactId} = req.params;
        const contact = await getContactById(contactId);
        contactId ?
            res.json({
                status: 'success',
                code: 200,
                data: contact,
            }) :
            res.status(404).json({
                status: 'failure',
                code: 404,
                message: "Not found",
            })
    } catch (error) {
        next(error);
    }
})

router.post('/', async (req, res, next) => {
    try {
        const {error, value} = postContactSchema.validate(req.body);

        if (error) {
            res.status(400).json({
                status: 'failure',
                code: 400,
                message: 'Validation error',
                details: error.details,
            });
            return;
        }

        const {name, email, phone} = value;
        const contact = await addContact({name, email, phone});
        res.status(201).json({
            status: 'Success',
            code: 201,
            data: contact,
        });
    } catch (error) {
        next(error);
    }
});

router.delete('/:contactId', async (req, res, next) => {
    try {
        const {contactId} = req.params;
        const contact = await getContactById(contactId);
        if (contact) {
            await removeContact(contactId);
            res.json({
                status: 'Successful',
                code: 200,
                message: "contact deleted"
            })
        } else {
            res.json({
                status: 'Failure',
                code: 404,
                message: "Not found"
            })
        }
    } catch (error) {
        next(error)
    }
})

router.put('/:contactId', async (req, res, next) => {
    try {
        const {error, value} = putContactSchema.validate(req.body);
        if (error) {
            res.status(400).json({
                status: 'failure',
                code: 400,
                message: 'Validation error',
                details: error.details,
            });
            return;
        }
        const {contactId} = req.params;
        const body = value;
        const contact = await getContactById(contactId);
        if (contact) {
            await updateContact(contactId, body);
            res.json({
                status: 'Successful',
                code: 200,
                message: 'Contact was updated successfully',
            });
        } else {
            res.json({
                status: 'Failure',
                code: 400,
                message: 'Contact of given ID does not exist',
            });
        }
    } catch (error) {
        next(error);
    }
});

router.patch('/:contactId/favorite', async (req, res, next) => {
    try {
        const {contactId} = req.params;
        const body = req.body;
        // eslint-disable-next-line no-prototype-builtins
        if (!body.hasOwnProperty('favorite')) {
            res.status(400).json({
                status: 'failure',
                code: 400,
                message: 'missing field favorite',
            });
        } else {
            const contact = await getContactById(contactId);
            if (!contact) {
                res.json({
                    status: 'Failure',
                    code: 404,
                    message: 'Contact of given ID does not exist',
                });
            } else {
                await updateStatusContact(contactId, body.favorite);
                res.status(200).json({
                    status: 'success',
                    code: 200,
                    message: 'Contact added to favorites'
                })
            }
        }
    } catch (error) {
        next(error)
    }
})

module.exports = router