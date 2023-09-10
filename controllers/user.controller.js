const User = require('../schemas/user.schema');
const gravatar = require('gravatar');

const createUsersAvatarUrl = async (email) => {
    return gravatar.url(email, {protocol: 'https'});
}
const findUser = async (email) => {
    return User.findOne({email});
}
const registerUser = async (email, password) => {
    const avatarURL = await createUsersAvatarUrl(email);
    return User.create({email, password, avatarURL});
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

module.exports = {
    registerUser,
    findUser,
    authenticateUser,
    setToken,
    updateUsersAvatarURL,
};