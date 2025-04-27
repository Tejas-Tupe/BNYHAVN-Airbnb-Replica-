if(process.env.NODE_ENV != 'Production') { // which when project in development phase then can only use dotenv other wise in production we will use differt method
    require('dotenv').config() // this is for storing environmental varibels 
}

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// configuring cloud credientials

cloudinary.config({
    cloud_name:process.env.Cloud_Name,
    api_key:process.env.API_Key,
    api_secret:process.env.API_Secret
})



const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'BNYAVN_Dev',
      allowed_formats: ['jpg','png','jpeg']
    },
  });

  module.exports = {storage,cloudinary}