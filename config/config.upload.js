const path = require('node:path');

const getTempPath = () => {
    return path.join(process.cwd(), 'tmp');
};

const getAvatarUploadsPath = () => {
    return path.join(process.cwd(), 'public', 'avatars');
};

module.exports = {
    TMP_PATH: getTempPath(),
    UPLOADS_PATH: getAvatarUploadsPath(),
};