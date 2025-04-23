// No need to call require('dotenv').config() here
// It's already called in server.js to load environment variables globally

const Cloudinary = require('cloudinary').v2; // Import Cloudinary v2

// Configure Cloudinary with credentials from the .env file
Cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Your Cloudinary cloud name
    api_key: process.env.CLOUDINARY_API_KEY,       // Your Cloudinary API key
    api_secret: process.env.CLOUDINARY_API_SECRET  // Your Cloudinary API secret
});

// Export the configured Cloudinary instance to use in other files
module.exports = Cloudinary;
