const User = require('../schemas/user.schema');
const gravatar = require('gravatar');
const {v4: uuidv4} = require('uuid');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = async (email) => {
    const signupMessage = {
        to: email,
        from: 'whitenoisechar@gmail.com',
        subject: 'Registration',
        text: 'Registration was successful. To verify send request on: /users/verify/:verificationToken',
        html: '<strong>Successful</strong>',
    };
    sgMail
        .send(signupMessage)
        .then(() => {
            console.log('Email sent');
        })
        .catch(error => {
            console.error(error);
        });
}

const createUsersAvatarUrl = async (email) => {
    return gravatar.url(email, {protocol: 'https'});
}
const findUser = async (email) => {
    return User.findOne({email});
}
const registerUser = async (email, password) => {

    const avatarURL = await createUsersAvatarUrl(email);
    const token = uuidv4();
    await sendVerificationEmail(email);
    return User.create({email, password, avatarURL, verificationToken: token});
}

const authenticateUser = async (email, password) => {
    return User.findOne({email, password});
}

const setToken = async (email, token) => {
    return User.updateOne({email}, {token});
}

const updateUsersAvatarURL = async (email) => {
    return User.updateOne({email}, {avatarURL: await createUsersAvatarUrl(email)});
}

const searchByTokens = async (token) => {
    return User.findOne({token});
}

const updateVerificationStatusSuccessfully = async (token) => {
    return User.updateOne({token}, {verificationToken: null, verify: true});
}

module.exports = {
    registerUser,
    findUser,
    authenticateUser,
    setToken,
    updateUsersAvatarURL,
    searchByTokens,
    updateVerificationStatusSuccessfully,
    sendVerificationEmail,
};