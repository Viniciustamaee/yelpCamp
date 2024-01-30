const Campground = require('../models/campground')
const { campgroundSchema, reviewSchema } = require('../schemas')



module.exports.index = (req, res) => {
    Campground.selectAllCamp((err, results) => {
        if (err) {
            res.status(500).send('Erro ao obter os produtos');
        } else {
            res.render("campground/index", { results })
        }
    });
}

module.exports.new = (req, res) => {
    res.render('campground/new')
}

module.exports.campDetails = (req, res) => {
    const { id } = req.params;
    const id_user = res.locals.user;
    Campground.getCampgroundDetails(id, (error, results, resultsReviews) => {
        if (error) {
            console.error(error);
            const status = error.status || 500;
            res.status(status).render('err', { status, error: error.error });
        } else {
            res.render('campground/show', { results, resultsReviews, id_user });
        }
    });
}

module.exports.edit = (req, res) => {
    const { id } = req.params;
    Campground.selectCampById(id, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Erro ao obter os produtos');
        } else {
            res.render('campground/edit', { results });
        }
    });
}

module.exports.insert = (req, res) => {
    const { title, location, price, description, imgs } = req.body;
    const id_user = res.locals.user;
    const { error, value } = campgroundSchema.validate({ title, location, price, description, imgs });

    if (error) {
        const err = error.details[0].message;
        const sta = 400;
        return res.status(400).render('err', { err, sta });
    }
    Campground.insertCampground({ title, location, price, description, imgs, id_user }, (err, id) => {
        if (err) {
            console.error(err);
            res.status(500).send('Erro interno do servidor');
        } else {
            req.flash('sucess', 'Sucessfully made a new campground');
            res.redirect(`/campgrounds/${id}`);
        }
    });
}

module.exports.delete = (req, res) => {
    const { id } = req.params;

    Campground.deleteCampgroundAndReviews(id, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Erro interno no servidor');
        } else {
            res.redirect('/campgrounds');
        }
    });
}

module.exports.updateCamp = (req, res) => {
    const { id } = req.params;
    const { title, location, price, description, imgs } = req.body;
    const { error: infoError, value: validatedInfo } = campgroundSchema.validate({ title, location, price, description, imgs });
    if (infoError) {
        const err = infoError.details[0].message;
        const sta = '400';
        return res.status(400).render('err', { err, sta });
    }
    Campground.updateCampground({ id, title, location, price, description, imgs }, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao atualizar o produto no banco de dados.' });
        } else {
            req.flash('sucess', 'Sucessfully updated campground');
            res.redirect(`/campgrounds/${id}`);
        }
    });
}