if(process.env.NODE_ENV != 'Production') { // which when project in development phase then can only use dotenv other wise in production we will use differt method
    require('dotenv').config() // this is for storing environmental varibels 
}
let express = require('express');
let listings = express.Router();
let Reviews = express.Router();
let mongodb = require('../databasefiles/db.js');
let schemavalidator = require('../databasefiles/SchemaValidator.js')
let customerrors = require('../init/errroclass.js');
let flash = require('connect-flash')
let passport = require('passport');
let listingscontrollers = require('../controllers/listings.js')
let reviewcontrollers = require('../controllers/reviews.js')
const multer = require('multer');
let {storage} = require('../CloudConfiger.js') 
const upload = multer({storage}); // storing data after parsing in multer and uploading in cloud 
const Editedupload = multer({storage});


listings.get('/', listingscontrollers.indexroute)

listings.get('/new',listingscontrollers.newlistingform)

listings.post('/new',upload.single('listingImage'),listingscontrollers.newlistingsubmit);

listings.get('/listingsfilter/:usercategory',listingscontrollers.filteredlistings);

listings.get('/:id',listingscontrollers.detailedlisting);

listings.get('/edit/:id',listingscontrollers.editlisting);

// always use for updating details from data 
listings.patch('/edit/:id',Editedupload.single('editedimage'),listingscontrollers.editlistingpost) // Editedupload.single('editedimage') in this filed editedimage is a HTML form name should be same

listings.delete('/delete/:id',listingscontrollers.deletelisting)

// Review route for deleting Reveiws
Reviews.delete('/delete/:listid/:id',reviewcontrollers.deletereview)


// Review Route for Adding New Reviews
Reviews.post('/:id', reviewcontrollers.newreview)

module.exports = { listings, Reviews };