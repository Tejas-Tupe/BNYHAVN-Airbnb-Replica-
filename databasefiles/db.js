let mongodb = require('mongoose');
let PassportMongoLocal = require('passport-local-mongoose')


async function dbrun() {
    try {
        //await mongodb.connect('mongodb://127.0.0.1:27017/BNYHAVN');
        const AtlasUrl = process.env.Atlas_Link
        await mongodb.connect(AtlasUrl)
    }
    catch (err) {
        console.log('DataBase Connection Error')
    }
}

dbrun();

let userSchema = new mongodb.Schema({
    email: {
        type: String,
        required: true
    }
})

let listingschema = new mongodb.Schema({
    title: {
        type: String,
    },
    description: {
        type: String
    },
    image: {
        filename: {
            type: String,
        },
        path: {
            type: String
        }
    },
    price: {
        type: Number
    },
    location: {
        type: String
    },
    country: {
        type: String
    },
    owner: {
        type: mongodb.Types.ObjectId,
        ref: 'User'
    },
    category:{
        type:String
    },
    geometry: { // for storing hole germetry object from mapbox API
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
})



let ReviewSchema = new mongodb.Schema({
    reviewCount: {
        default: 0,
        type: Number,
        min: 0,
        max: 5
    },
    comment: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    onlisting: {
        type: mongodb.Types.ObjectId,
        ref: "listing"
    },
    reviewowner: {
        type: mongodb.Types.ObjectId,
        ref: 'User'
    }
})
// user schema 
userSchema.plugin(PassportMongoLocal);

let listing = mongodb.model('listing', listingschema);
let Review = mongodb.model('Review', ReviewSchema);
let User = mongodb.model('User', userSchema);

module.exports = { listing, Review, User };






