const fs = require('node:fs').promises;
const path = require("path");
const AVATARS_DIR = path.join(process.cwd(), 'public', 'avatars')
const uploadFile = async (req, res, next) => {
    const {path: temporaryFilePath, originalname: originalFileName} = req.file;
    const destinationPath = path.join(AVATARS_DIR, originalFileName);
    try {
        await fs.rename(temporaryFilePath, destinationPath);
    } catch (err) {
        await fs.unlink(temporaryFilePath);
        return next(err);
    }
};

module.exports = {
    uploadFile,
};