const app = require('./app');
const mongoose = require('mongoose');
const fs = require('node:fs').promises;
const config = require('./config/config.upload')
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const URIDB = process.env.DB_HOST;

const connection = mongoose.connect(URIDB, {
    dbName: 'db-contacts',
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const isAccessible = path => {
    return fs
        .access(path)
        .then(() => true)
        .catch(() => false);
};

const createFolderIsNotExist = async folder => {
    if (!(await isAccessible(folder))) {
        await fs.mkdir(folder,
            {recursive: true});
    }
};
connection
    .then(() => {
        app.listen(PORT, async () => {
            await createFolderIsNotExist(config.UPLOADS_PATH);
            console.log(`Server running. Database connection successful. Use our API on port: ${PORT}`);
        });
    })
    .catch((err) => {
        console.error(`Server not running. Error message: ${err.message}`);
        process.exit(1);
    });
