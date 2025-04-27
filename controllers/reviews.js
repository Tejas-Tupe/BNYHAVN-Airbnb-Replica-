let schemavalidator = require('../databasefiles/SchemaValidator.js')
let customerrors = require('../init/errroclass.js');
let flash = require('connect-flash')
let passport = require('passport');
let mongodb = require('../databasefiles/db.js');

async function deletereview(req,res,next) {
    if (!req.isAuthenticated()) { // this function checks a user has logged in or not 
        req.flash('listingsFlashes', 'You must be logged in first')
        return res.redirect('/listings') // must return
    }
    let { id, listid } = req.params;
    let deletereview = await mongodb.Review.findById(id);

    if (req.user?._id.toString() === deletereview.reviewowner?.toString()) { // only owner can delete this review
        await mongodb.Review.findByIdAndDelete(id).catch((err) => {
            next(new customerrors(403, err))
        })
        res.redirect(`/listings/${listid}`)
    }
    else {
        req.flash('error', 'you do not have authority to delete this review')
        res.redirect('/listings')
    }
}

async function newreview(req,res,next) {
    try {
        let { id } = req.params
        let sv = schemavalidator.Reviewform.validate(req.body);
        if (sv.error) {
            return next(new customerrors(410, sv.error.details[0].message))
        }

        if (!req.isAuthenticated()) { // this function checks a user has logged in or not 
            req.flash('listingsFlashes', 'You must be logged in first')
            return res.redirect('/listings') // must return
        }
        let review = await new mongodb.Review({
            reviewCount: req.body.rating,
            comment: req.body.Comment,
            createdAt: Date.now(),
            onlisting: id,
            reviewowner: req.user?._id // review owner id
        }).save()
        res.redirect('/listings')
    } catch (err) {
        next(new customerrors(404, 'In Review :', err))
    }
}

module.exports = {deletereview,newreview}