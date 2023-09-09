const path = require('node:path')
const getUploadsPath = () => {
    return path.join(process.cwd(),'public','avatars');}

module.exports = {
    UPLOADS_PATH: getUploadsPath(),
}