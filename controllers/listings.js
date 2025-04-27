let schemavalidator = require('../databasefiles/SchemaValidator.js')
let customerrors = require('../init/errroclass.js');
let flash = require('connect-flash')
let passport = require('passport');
let mongodb = require('../databasefiles/db.js');
const multer = require('multer'); // for uploading files in form;
let MapBox_Token = process.env.MapBox_Token;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'); // Map Box Imp Requirements 
const GeocodingService = mbxGeocoding({ accessToken: MapBox_Token }); // Assembling 

async function indexroute(req, res, next) {
    try {
        let listings = await mongodb.listing.find({});
        res.render('index.ejs', { listings })
    }
    catch (err) {
        next(new customerrors(500, err))
    }

}

async function filteredlistings(req,res,next) {
    let {usercategory} = req.params
    let listings = await mongodb.listing.find({category:usercategory}).populate('owner')
    if(listings.length > 0) {
    
    return res.render('filtered.ejs',{listings})
    }
    req.flash('error','no matching listings found')
    res.redirect('/listings')
}

async function newlistingform(req, res, next) {
    if (!req.isAuthenticated()) { // this function checks a user has logged in or not 
        req.flash('listingsFlashes', 'You must be logged in for creating listing')
        return res.redirect('/listings') // must return
    }
    res.render('new.ejs')
}

async function newlistingsubmit(req, res, next) { // listings image is not storing into the cloudinary
  try {
       
        let sv = schemavalidator.Allform.validate(req.body);
       
        if (sv.error) {
            return next(new customerrors(401, sv.error.details[0].message))
        }
         
        let filename = req.file.filename;
        let path = req.file.path;

        let newlistings = req.body;
        newlistings.image = { filename, path };
        newlistings.owner = req.user._id

        
        let { location, country } = newlistings;
      
        const GeocodingResponse = await GeocodingService.forwardGeocode({ // Geocoding Logic for Forward Geocoding means Getting Longitude And Laltitude
            query: `${location},${country}`, // Inserting form location and country into module
            limit: 1
        }).send()
        const match = GeocodingResponse.body;
        if(match) {
        newlistings.geometry = match.features[0].geometry // [longitude, latitude] Storing hole geomatry object in the paricular speficfic listing
        }
        else {
            console.log('mapbox failed here')
        }

        await new mongodb.listing(newlistings).save();
        req.flash('ListingAdded', 'Listing Added Succesfully') // Flash for adding new listing
        res.redirect('/listings')
  }
   catch (err) { 
        next(new customerrors(400, err || 'Bad request please check entered data'))
        console.log(err)
    }
}

async function detailedlisting(req, res, next) {
    try {
        let { id } = req.params
        let object = await mongodb.listing.findOne({ _id: id }).populate('owner');
        let reviews = await mongodb.Review.find({ onlisting: id }).populate('reviewowner');
        let currentuser = res.locals.currentuser;
        let currentuserid = currentuser?._id.toString();  // object _id converting to the string
        let ownerid = object.owner?._id.toString(); // ? checks if variable exist or not 
        let editdeletebutton = false;
        let Map_token = process.env.MapBox_Token; // we rendered it into detailed.ejs why coz its mapping logic in this file
        if (currentuserid === ownerid) {
            editdeletebutton = true
        }
        let longitude = object.geometry.coordinates[0]; // getting coordinates for detailed.ejs stored script js for mapping
        let latitude = object.geometry.coordinates[1];
        res.render('detailed.ejs', { object, reviews, editdeletebutton, Map_token, longitude, latitude })

    } catch (err) {
        next(new customerrors(501, err))
    }
}



async function editlisting(req, res, next) {
    try {
        if (!req.isAuthenticated()) { // this function checks a user has logged in or not 
            req.flash('listingsFlashes', 'You must be logged in first')
            return res.redirect('/listings') // must return
        }

        let { id } = req.params
        let current = await mongodb.listing.findOne({ _id: id })
        res.render('edit.ejs', { current });
    } catch (err) {
        next(new customerrors(500, 'Failed to load try again'))
    }
}


async function editlistingpost(req, res, next) {
    try {
        let sv = schemavalidator.Allform.validate(req.body);
        if (sv.error) {
            return next(new customerrors(401, sv.error.details[0].message))
        }
        let { id } = req.params;
        let updatails = req.body;
        let targatedlisting = await mongodb.listing.findById(id).populate('owner');
        let currentuser = req.user?._id.toString();
        let ownerid = targatedlisting.owner?._id.toString();

        if (currentuser === ownerid) {
            await mongodb.listing.updateOne({ _id: id }, { title: updatails.title })
            await mongodb.listing.updateOne({ _id: id }, { description: updatails.description })
            await mongodb.listing.updateOne({ _id: id }, { price: updatails.price })
            await mongodb.listing.updateOne({ _id: id }, { location: updatails.location })
            await mongodb.listing.updateOne({ _id: id }, { country: updatails.country })
            await mongodb.listing.updateOne({ _id: id }, { category: updatails.category })
            
            
            await mongodb.listing.updateOne({ _id: id }, { image: { filename: req.file?.filename || targatedlisting.image.filename, path: req.file?.path || targatedlisting.image.path} })
           
            const GeocodingResponse = await GeocodingService.forwardGeocode({ // Geocoding Logic for Forward Geocoding means Getting Longitude And Laltitude
                query: `${updatails.location},${updatails.country}`, // Inserting form location and country into module
                limit: 1
            }).send()
            const match = GeocodingResponse.body;
            if(match) {
            await mongodb.listing.updateOne({_id:id},{geometry:match.features[0].geometry}) // [longitude, latitude] Storing hole geomatry object in the paricular speficfic listing   
            }
            else {
                console.log('mapbox failed here')
            }

            res.redirect('/listings')
        }
        else {
            req.flash('error', 'You do not have authority to edit this listing')
            res.redirect('/listings')
        }
    }
    catch (err) {
        next(new customerrors(500, 'Failed to update data'))
    }
}

async function deletelisting(req, res, next) {
    try {
        if (!req.isAuthenticated()) { // this function checks a user has logged in or not 
            req.flash('listingsFlashes', 'You must be logged in first')
            return res.redirect('/listings') // must return
        }
        let { id } = req.params

        let targatedlisting = await mongodb.listing.findById(id).populate('owner');
        let currentuser = req.user?._id.toString();
        let ownerid = targatedlisting.owner?._id.toString();

        if (currentuser == ownerid) {
            await mongodb.Review.deleteMany({ onlisting: id }).catch((err) => next(new customerrors(500, err)))
            await mongodb.listing.findByIdAndDelete(id);
            req.flash('DelteListings', 'Listing Deleted Successfully');
            res.redirect(`/listings`)
        } else {
            req.flash('error', 'You do not have authority to delete this listing')
            res.redirect('/listings')
        }
    }
    catch (err) {
        next(new customerrors(500, 'Failed to Delete data'))
    }
}
module.exports = { indexroute, newlistingform, newlistingsubmit, detailedlisting, editlisting, editlistingpost, deletelisting,filteredlistings };
