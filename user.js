const mongoose = require("mongoose");
const bCrypt = require("bcryptjs");
const user = require("./schemas/user.model")

user.methods.setPassword = function (password) {
    this.password = bCrypt.hashSync(password, bCrypt.genSaltSync(6));
};

user.methods.validPassword = function (password) {
    return bCrypt.compareSync(password, this.password);
};

const User = mongoose.model("user", user);

module.exports = User;