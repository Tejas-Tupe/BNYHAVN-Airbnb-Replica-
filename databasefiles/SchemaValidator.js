const Joi = require('joi');
let joi = require('joi');

let Allform = joi.object({
    title: joi.string().trim().min(1).required(),
    description: joi.string().trim().min(1).required(),
    image: joi.string(),
    category:joi.string().required(),
    price: joi.number().min(0).required(),
    location: joi.string().trim().min(1).required(),
    country: joi.string().trim().min(1).required()
})

let Reviewform = joi.object({
    rating: joi.number().min(1).max(5).required(),
    Comment:joi.string().trim().min(1).required()
})

let userform = joi.object({
    useremail:Joi.string().min(1).trim().required(),
    username:joi.string().min(1).trim().required(),
    userpassword:joi.string().min(1).trim().required()
})

module.exports = {Allform,Reviewform,userform};