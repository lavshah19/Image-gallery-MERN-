// Import the Image model (MongoDB schema)
const Image = require('../models/Image');

// Import the Cloudinary helper function to upload images
const { uploadToCloudinary } = require('../helpers/cloudinaryHelper');
const cloudinary = require("../config/cloudinary");

// Import 'fs' to work with file system (for deleting local file after upload)
const fs = require('fs');

// ============================
// Controller to upload an image
// ============================
const uploadImageController = async (req, res) => {
  try {
      // Check if the request has a file attached (through multer middleware)
      if (!req.file) {
          return res.status(400).json({
              success: false,
              message: 'File is required. Please upload an image.'
          });
      }

      // Get the title from the request body
      const { title } = req.body;

      if (!title || title.trim() === '') {
          return res.status(400).json({
              success: false,
              message: 'Title is required.'
          });
      }

      // Upload the image to Cloudinary using the local file path
      const { url, publicId } = await uploadToCloudinary(req.file.path);

      // Create a new Image document with title, URL, publicId, and uploader
      const newlyUploadedImage = new Image({
          title: title.trim(),
          url,
          publicId,
          uploadedBy: req.userInfo.userId // assuming authentication middleware sets this
      });

      // Save the image details to the MongoDB database
      await newlyUploadedImage.save();

      // Optionally delete the image from local storage after uploading
      // fs.unlinkSync(req.file.path);

      // Send a success response
      res.status(201).json({
          success: true,
          message: "Image uploaded successfully.",
          image: newlyUploadedImage
      });

  } catch (error) {
      console.error(error);
      res.status(500).json({
          success: false,
          message: 'Something went wrong! Please try again.'
      });
  }
};

// ============================
// Controller to fetch all uploaded images
// ============================
const fetchImagesController = async (req, res) => {
  try {
    // Remove pagination logic
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    // Fetch all images without pagination
    const images = await Image.find()
      .sort(sortObj)
      .populate('uploadedBy', 'username'); // Populate 'uploadedBy' to get the 'username' field from the 'User' model

    if (images) {
      res.status(200).json({
        success: true,
        totalImages: images.length,  // You can get the total number of images directly
        data: images,  // Return all images
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong! Please try again.',
    });
  }
};



const deleteImageController = async (req, res) => {
    try {
      const getCurrentIdOfImageToBeDeleted = req.params.id;
      const userId = req.userInfo.userId;
  
      const image = await Image.findById(getCurrentIdOfImageToBeDeleted);
  
      if (!image) {
        return res.status(404).json({
          success: false,
          message: "Image not found",
        });
      }
  
      //check if this image is uploaded by the current user who is trying to delete this image
      if (image.uploadedBy.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: `You are not authorized to delete this image because you haven't uploaded it`,
        });
      }
  
      //delete this image first from your cloudinary stroage
      await cloudinary.uploader.destroy(image.publicId);
  
      
      // Delete this image from MongoDB database
await Image.findByIdAndDelete(getCurrentIdOfImageToBeDeleted);

  
      res.status(200).json({
        success: true,
        message: "Image deleted successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Something went wrong! Please try again",
      });
    }
  };


  //update image 
  const updateImageController = async (req, res) => {
    try {
      const imageId = req.params.id;
      const { title } = req.body;
  
      // Find the image by ID
      const image = await Image.findById(imageId);
  
      // Check if image exists
      if (!image) {
        return res.status(404).json({
          success: false,
          message: 'Image not found',
        });
      }
  
      // Check if the current user is the uploader
      if (image.uploadedBy.toString() !== req.userInfo.userId) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to update this image',
        });
      }
  
      // Update the title
      image.title = title || image.title;
      await image.save();
  
      res.status(200).json({
        success: true,
        message: 'Image updated successfully',
        image,
      });
    } catch (error) {
      console.error('Update error:', error);
      res.status(500).json({
        success: false,
        message: 'Something went wrong while updating the image',
      });
    }
  };

  //single img fetch
  // Get single image by ID
const getSingleImageController = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id).populate('uploadedBy', 'username');
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    res.status(200).json({
      success: true,
      image,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch image',
    });
  }
};

//likes controller
const toggleLike = async (req, res) => {
  const userId = req.userInfo.userId;
  const imageId = req.params.id;

  try {
    const image = await Image.findById(imageId);
    if (!image) return res.status(404).json({ message: 'Image not found' });

    const liked = image.likes.includes(userId);

    if (liked) {
      image.likes.pull(userId); // Unlike
    } else {
      image.likes.push(userId); // Like
    }

    await image.save();
    res.status(200).json({
      liked: !liked,
      totalLikes: image.likes.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
// comment controller
const commentController=async (req,res)=>{
  const { id } = req.params;
  const { text } = req.body;

  if (!text) return res.status(400).json({ message: 'Comment text is required' });

  try {
    const image = await Image.findById(id);
    if (!image) return res.status(404).json({ message: 'Image not found' });

    const user = req.userInfo // Assuming user info is attached in `auth` middleware

    image.comments.push({
      userId: user.userId,
      username: user.username,
      text
    });

    await image.save();

    res.json({ message: 'Comment added', comments: image.comments });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }

}

//delete comment

const deleteComment = async (req, res) => {
  const { imageId, commentId } = req.params;
  const userId = req.userInfo.userId;
  
  try {
    const image = await Image.findById(imageId);
    if (!image) return res.status(404).json({ error: 'Image not found' });
    
    const comment = image.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    
    console.log('Logged in userId:', userId);
    console.log('Comment userId:', comment.userId);
    
    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }
    
    // Use pull instead of remove
    image.comments.pull(commentId);
    await image.save();
    
    res.status(200).json({ message: 'Comment deleted successfully', comments: image.comments });
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
  
  


// Export both controllers to use in routes
module.exports = {
    uploadImageController,
    fetchImagesController,
    deleteImageController,
    updateImageController,
    getSingleImageController,
    toggleLike,
    commentController,
    deleteComment
  };
