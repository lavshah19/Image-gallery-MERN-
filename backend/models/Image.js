// Import the mongoose library for working with MongoDB
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: String,
    text: String,
    createdAt: { type: Date, default: Date.now }
  });



// Define the schema (structure) for an "Image" document in the database
const ImageSchema = new mongoose.Schema({

    // The title of the image
    title: {
        type: String,
        required: true, // Mark as required, or false if optional
        trim: true // Removes extra spaces
    },

    // The URL where the image is stored (e.g., Cloudinary, AWS, etc.)
    url: {
        type: String,
        required: true
    },

    // The public ID of the image provided by the cloud storage service
    publicId: {
        type: String,
        required: true
    },

    // The ID of the user who uploaded this image
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }, likes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User', // So you can track who liked it
        },
      ],
      comments: [commentSchema]

}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Export the model so it can be used in other parts of the project
module.exports = mongoose.model("Image", ImageSchema);
