let express = require('express');
let NewUser = express.Router();
let UserForm = require('../databasefiles/db.js')
let passport = require('passport');
let localPassport = require('passport-local') // configuring strategy
let customerrors = require('../init/errroclass.js');
let schemavalidator = require('../databasefiles/SchemaValidator.js');
let flash = require('connect-flash')


NewUser.post('/register',async (req,res,next)=>{
    try {
      let sv =  schemavalidator.userform.validate(req.body)
      if (sv.error) {
        return next(new customerrors(401, sv.error.details[0].message))
    }
        let addinguser = new UserForm.User({
            email:req.body.username, // swaped in email section will store username 
            username:req.body.useremail, // swaped in username section wil store email why ? coz passport only detects username but we want login using an email so in field of username we will store an email simple
        })
        let saveuser = await UserForm.User.register(addinguser,req.body.userpassword)
        req.login(saveuser,(err)=>{ // automatically login function by passport after signing up
            if(err) {
                return next(new customerrors(500,'failed to login try to login by login button'));
            }
            req.flash('userloginflash','Welcome to BNYHAVN')
            res.redirect('/listings')
        })
    }catch(err){
        next(new customerrors(500,err));
    }
})

module.exports = NewUser