const fs = require('node:fs').promises;
const path = require("path");
const Jimp = require('jimp');
const {
    updateUsersAvatarURL,
} = require('../controllers/user.controller');
const AVATARS_DIR = path.join(process.cwd(), 'public', 'avatars')
const uploadFile = async (req, res, next) => {
    const {description} = req.body;
    const {path: temporaryName, originalname} = req.file;
    const fileName = path.join(AVATARS_DIR, originalname);
    try {
        await fs.rename(temporaryName, fileName);
    } catch (err) {
        await fs.unlink(temporaryName);
        return next(err);
    }
    return res.json({
        description,
        message: "File uploaded successfully",
        status: 200
    });
};
const createAndSaveAvatar = async (email, image) => {
    const uniqueFileName = generateUniqueFileName(email);
    const tmpAvatarPath = `tmp/${uniqueFileName}.jpg`;
    const avatarDestination = 'public/avatars';
    const avatar = await Jimp.read(image);
    await avatar.resize(250, 250);
    await avatar.writeAsync(tmpAvatarPath);
    const destinationPath = `${avatarDestination}/${uniqueFileName}.jpg`;
    await moveAvatarToPublic(tmpAvatarPath, destinationPath);
    await updateUsersAvatarURL(email, destinationPath);
    return `/avatars/${uniqueFileName}.jpg`;
};
const moveAvatarToPublic = async (sourcePath, destinationPath) => {
    const fs = require('fs').promises;
    await fs.rename(sourcePath, destinationPath);
};
const generateUniqueFileName = (email) => {
    return email.replace(/[^a-z0-9]/gi, '_').toLowerCase();
};

module.exports = {
    uploadFile,
    AVATARS_DIR,
    createAndSaveAvatar
};