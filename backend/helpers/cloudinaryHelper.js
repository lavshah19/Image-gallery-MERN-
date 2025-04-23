// Import the configured Cloudinary instance from config file
const cloudinary = require('../config/cloudinary');

// Define an async function to upload a file to Cloudinary
const uploadToCloudinary = async (filePath) => {
    try {
        // Upload the file to Cloudinary using the file path
        const result = await cloudinary.uploader.upload(filePath);

        // Return only the secure URL and public ID from the result
        return {
            url: result.secure_url,    // URL of the uploaded image (accessible online)
            publicId: result.public_id // Unique ID assigned by Cloudinary (used for deleting later)
        };

    } catch (e) {
        // Log the error and throw a new error to handle it in routes or controllers
        console.log('Error while uploading to Cloudinary:', e);
        throw new Error('Error while uploading to Cloudinary');
    }
};

// Export the function so it can be used in other files (like in controllers)
module.exports = {
    uploadToCloudinary
};
