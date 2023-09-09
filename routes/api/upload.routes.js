const express = require('express');
const router = express.Router();
const uploadController = require('../../controllers/upload.controller');
const multer = require("multer");
const config = require('../../config/config.upload');
const fs = require("fs");

const upload = multer({
    dest: config.UPLOADS_PATH,
});

router.post('/', upload.single('file'), uploadController.uploadFile);

router.get('/avatars/:fileName', async (req, res, next) => {
    try {
        const {fileName} = req.params;
        fs.readFile(`public/avatars/${fileName}`, (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send('There was an error with getting data.');
            } else {
                res.setHeader('Content-Type', 'image/png');
                res.setHeader('Content-Length', data.length);
                res.end(data);
            }
        })
    } catch (err) {
        next(err);
    }
})

module.exports = router;