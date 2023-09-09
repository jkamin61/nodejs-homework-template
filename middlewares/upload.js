const multer = require('multer');
const config = require('../config/config.upload')

const upload = multer({
    storage: multer.diskStorage({
        destination: (_, __, callback) => {
            callback(null, config.UPLOADS_PATH);
        },
        filename: (_, file, callback) => {
            callback(file.originalname);
        },
    })
})

module.exports = (fieldName) => upload.single(fieldName);