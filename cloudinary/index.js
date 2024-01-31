const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


// Isso precisa ficar em .env
cloudinary.config({
    cloud_name: 'dtuxy5k7v',
    api_key: '631759363798366',
    api_secret: 'j3AdG6dgyludTedwZB2zQKBws54'
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'YelpCamp',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});

module.exports = {
    cloudinary,
    storage
}