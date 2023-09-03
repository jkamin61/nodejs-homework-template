const express = require('express')
const Joi = require('joi');
const router = express.Router()
const jwt = require('jsonwebtoken')
const passport = require('passport')
const User = require('../../schemas/userSchema');
require('dotenv').config()
const secret = process.env.SECRET
const {
    registerUser,
    findUser,
    authenticateUser
} = require("../../models/userController");

const userJoiSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
        .regex(/[0-9a-zA-Z]*\d[0-9a-zA-Z]*/)
        .min(4)
        .required(),
});

const auth = (req, res, next) => {
    passport.authenticate('jwt', {session: false}, (err, user) => {
        if (!user || err) {
            return res.status(401).json({
                status: 'error',
                code: 401,
                message: 'Unauthorized',
                data: 'Unauthorized',
            })
        }
        req.user = user
        next()
    })(req, res, next)
}

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
            res.status(400).json({
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
            res.json({
                status: 'success',
                code: 200,
                data: {
                    token,
                },
            })
        }
    } catch (error) {
        next(error);
    }
})

router.get('/logout', auth, async (req, res, next) => {
    const {username} = req.user
    res.json({
        status: 'success',
        code: 200,
        data: {
            message: `Authorization was successful: ${username}`,
        },
    })
})

router.get('/current', auth, async (req, res, next) => {
    const {email} = req.user;
    res.json({
        status: 'success',
        code: 200,
        data: {
            message: `Authorization was successful, user's data: ${email}`
        },
    })
})

module.exports = router;