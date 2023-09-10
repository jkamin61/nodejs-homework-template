const fs = require('node:fs').promises;
const path = require("path");

const AVATARS_DIR = path.join(process.cwd(),'public','avatars')
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

module.exports = {
    uploadFile,
    AVATARS_DIR
};