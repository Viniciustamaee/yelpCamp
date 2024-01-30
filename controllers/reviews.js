const Reviews = require('../models/reviews')

module.exports.insert = (req, res) => {
    const { rating, comment } = req.body;
    const id_user = res.locals.user;
    const { id } = req.params;
    Reviews.insertReview({ rating, comment, id_camp: id, id_user }, (error, result) => {
        if (error) {
            console.error(error);
            req.flash('error', 'Failed to create a new review');
        } else {
            req.flash('success', 'Created a new review!');
        }
        res.redirect(`/campgrounds/${id}`);
    });
}

module.exports.delete = (req, res) => {
    const { id, reviewId } = req.params;
    Reviews.deleteReview(reviewId, (error, results) => {
        if (error) {
            console.error(error);
            req.flash('error', 'Failed to delete the review');
            res.status(500).send('Erro interno no servidor');
        } else {
            req.flash('success', 'Successfully deleted the review!');
            res.redirect(`/campgrounds/${id}`);
        }
    });
}