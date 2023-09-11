const express = require('express')
const Joi = require('joi');
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../../schemas/user.schema');
require('dotenv').config()
const secret = process.env.SECRET
const {
    registerUser,
    findUser,
    authenticateUser,
    setToken,
    updateUsersAvatarURL,
} = require("../../controllers/user.controller");
const upload = require("../../middlewares/upload");
const auth = require("../../middlewares/auth")
const {uploadFile} = require("../../controllers/upload.controller");

const userJoiSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
        .regex(/[0-9a-zA-Z]*\d[0-9a-zA-Z]*/)
        .min(4)
        .required(),
});

router.post('/signup', async (req, res, next) => {
    try {
        const {error, value} = userJoiSchema.validate(req.body);
        if (error) {
            res.status(400).json({
                status: 'Conflict',
                code: 400,
                message: "Validation error",
                details: error.details,
            });
            return;
        }
        const {email, password} = value;
        const existingUser = await findUser(email);
        if (existingUser) {
            res.status(400).json({
                status: 'Conflict',
                code: 400,
                message: "Email in use",
            });
        } else {
            const user = await registerUser(email, password);
            res.status(201).json({
                status: 'Success',
                code: 201,
                data: user,
            });

        }
    } catch (error) {
        next(error);
    }
})

router.post('/login', async (req, res, next) => {
    try {
        const {error, value} = userJoiSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 'Bad Request',
                code: 400,
                message: "Validation error",
                details: error.details,
            })
        }
        const {email, password} = value;
        const user = await User.findOne({email})
        const userAuth = await authenticateUser(email, password);
        if (userAuth) {
            const payload = {
                id: user.id,
                username: user.username,
            }
            const token = jwt.sign(payload, secret, {expiresIn: '1h'})
            await setToken(user.email, token);
            return res.json({
                status: 'success',
                code: 200,
                data: {
                    token,
                },
            })
        } else {
            return res.json({
                status: 'failure',
                code: 400,
                message: error
            })
        }
    } catch (error) {
        next(error);
    }
})

router.get('/logout', auth, async (req, res, next) => {
    const {email} = req.user;
    await setToken(email, null);
    res.json({
        status: 'success',
        code: 200,
        data: {
            message: `Authorization was successful: ${email}`,
        },
    })
})

router.get('/current', auth, async (req, res, next) => {
    const {email, subscription} = req.user;
    res.json({
        status: 'success',
        code: 200,
        data: {
            email: email,
            subscription: subscription
        },
    })
})

router.patch('/avatars', auth, upload.single('avatar'), async (req, res, next) => {
    try {
        const {email} = req.user;
        const avatarURL = await updateUsersAvatarURL(email);
        await uploadFile(req, res,next);
        res.json({
            status: 'OK',
            code: 200,
            data: {
                avatarURL,
            },
            message: "File uploaded successfully"
        })
    } catch (err) {
        next(err);
        res.json({
            status: 'failure',
            code: 400,
            message: err.message
        })
    }

});

module.exports = router;