const express = require('express')
const { isLoggin } = require('../middleware')
const router = express.Router();
const campgroundControll = require('../controllers/campground')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

router.get('/', campgroundControll.index);
router.get('/new', isLoggin, campgroundControll.new);
router.get('/:id', isLoggin, campgroundControll.campDetails);
router.get('/:id/edit', isLoggin, campgroundControll.edit);
router.post('/', isLoggin, upload.single('imgs'), campgroundControll.insert)
router.delete('/:id', isLoggin, campgroundControll.delete);
router.put('/:id', upload.single('imgs'), campgroundControll.updateCamp);

module.exports = router;