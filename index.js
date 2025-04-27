if(process.env.NODE_ENV != 'Production') { // which when project in development phase then can only use dotenv other wise in production we will use differt method
    require('dotenv').config() // this is for storing environmental varibels 
}
let express = require('express');
let app = express();
app.set('viewengine', 'ejs');
let path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
let ejsmate = require('ejs-mate');
let methodoverride = require('method-override');
app.use(methodoverride("_method"));
app.engine('ejs', ejsmate) // for EJS BoletilerPlate Templetes.
let Router = require('./Routes/ListingAndReviewsRoutes.js')
let RouterforNewUser = require('./Routes/NewUser.js')
let Routerforuserloginlogout = require('./Routes/userslogin-logout.js')
let session = require('express-session')
let mongoStore = require('connect-mongo')
let flash = require('connect-flash')
let passport = require('passport');
let localPassport = require('passport-local')
let customerrors = require('./init/errroclass.js');
let User = require('./databasefiles/db.js');
let mongodb = require('./databasefiles/db.js');

let AtlasUrl = process.env.Atlas_Link;

const Store = mongoStore.create({  // creating this for session information will save in atlas 
    mongoUrl:AtlasUrl,
    crypto: {
        secret: process.env.Mongo_Secret,
    },
    touchAfter: 1000 * 60 * 60 * 24 * 7
})


Store.on('error',(err)=>{
    console.log('error in Mongo Store',err)
})
app.use(session({
    Store, // passing it here in express session
    resave:false,
    saveUninitialized:true,
    secret:process.env.Mongo_Secret,
    cookie:{ // cookie related information like when cookie will expires  
        maxAge:1000 * 60 * 60 * 24 * 7, // session seted to 7 days after logged in
        httpOnly:true
    }
}))


app.use(passport.initialize()); // for user authentication always these lines after session code
app.use(passport.session());
passport.use(new localPassport(User.User.authenticate()))
passport.serializeUser(User.User.serializeUser());
passport.deserializeUser(User.User.deserializeUser())   

app.use(flash()) // Flash Middleware

app.use((req,res,next)=>{ // local varibels middleware
    res.locals.ListingAdded = req.flash('ListingAdded');
    res.locals.DelteListings = req.flash('DelteListings');
    res.locals.listingsFlashes = req.flash('listingsFlashes'); // All Listings related flash execpt login 
    res.locals.error = req.flash('error'); // very imp for passport failure flash message accesskey
    res.locals.userloginflash = req.flash('userloginflash') // successfull login flash message
    res.locals.userlogout = req.flash('userlogout'); 
    res.locals.currentuser = req.user // this local varible stores user information for accsessing login,out,signup buttons flow
    next();
})

app.listen(10000, (req, res) => {
    console.log('Server is started on port 10,000');
})

app.get('/', async(req, res) => {
   let listings = await mongodb.listing.find({});
           res.render('index.ejs', { listings })
})

app.use('/listings',Router.listings);
app.use('/reviews',Router.Reviews);
app.use('/newuser',RouterforNewUser);
app.use('/user',Routerforuserloginlogout)

app.all('*', (req, res, next) => {
    next(new customerrors(404, 'Page not found'))
})

// error handler middleware
app.use((err, req, res, next) => {
    let errorobj = err;
    res.render('error.ejs', { errorobj })
})






