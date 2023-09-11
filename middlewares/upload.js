const multer = require('multer');
const config = require('../config/config.upload')

const upload = multer({
    storage: multer.diskStorage({
        destination: (_, __, callback) => {
            callback(null, config.TMP_PATH);
        },
        filename: (_, file, callback) => {
            callback(null, file.originalname);
        },
    })
})

module.exports = upload;