const User = require('../schemas/userSchema');

const findUser = async (email) => {
    return User.findOne({email});
}
const registerUser = async (email, password) => {
    return User.create({email, password})
}

const authenticateUser = async (email, password) => {
    return User.findOne({email, password});
}

module.exports = {
    registerUser,
    findUser,
    authenticateUser
};