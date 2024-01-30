const express = require('express')
const { isLoggin } = require('../middleware')
const router = express.Router();
const campgroundControll = require('../controllers/campground')

router.get('/', campgroundControll.index);
router.get('/new', isLoggin, campgroundControll.new);
router.get('/:id', isLoggin, campgroundControll.campDetails);
router.get('/:id/edit', isLoggin, campgroundControll.edit);
router.post('/', isLoggin, campgroundControll.insert);
router.delete('/:id', isLoggin, campgroundControll.delete);
router.put('/:id', campgroundControll.updateCamp);

module.exports = router;