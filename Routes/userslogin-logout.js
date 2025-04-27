let express = require('express');
let passport = require('passport');
let user = express.Router();
let flash = require('connect-flash')
let customerrors = require('../init/errroclass.js')



user.post('/login',passport.authenticate("local",{failureRedirect:'/listings',failureFlash:true}), async (req,res)=>{ // line in built passport function for loging user
    req.flash('userloginflash','Welcome back to BNYHAVN')
    res.redirect('/listings')
})

user.get('/logout',(req,res)=>{
    req.logout((err)=>{ //  automatically terminated current user session this function from passport
        if(err) {
          return  next(new customerrors(500,err))
        }
        req.flash('userlogout','Log out Successfully')
        res.redirect('/listings')
    })
})
module.exports = user;