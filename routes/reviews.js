const express = require('express')
const rount = express.Router()
const { isLoggin } = require('../middleware')
const reviewsControll = require('../controllers/reviews')

rount.post('/:id/reviews', isLoggin, reviewsControll.insert);
rount.delete('/:id/reviews/:reviewId', reviewsControll.delete);

module.exports = rount