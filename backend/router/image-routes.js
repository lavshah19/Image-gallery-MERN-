// Import express and create a router
const express = require("express");
const router = express.Router();

// Import middlewares
const authMiddleware = require("../middleware/auth-middleware"); // Checks if the user is authenticated
const adminMiddleware = require("../middleware/admin-middleware"); // Checks if the user has admin privileges
const uploadMiddleware = require("../middleware/upload-middleware"); // Handles file uploads (using multer)

// Import controllers
const {
  uploadImageController,
  fetchImagesController,
  deleteImageController,
  updateImageController,
  getSingleImageController,
  toggleLike,
  commentController,
  deleteComment
} = require("../controllers/image-controller");

// ===============================
// Route to upload an image
// ===============================
// POST /api/image/upload
// Steps:
// 1. Authenticate user
// 2. Check if user is admin
// 3. Use multer to handle image upload from form-data field named "image"
// 4. Then call the controller to handle uploading to Cloudinary and saving to DB
router.post(
  "/upload",
  authMiddleware,
  adminMiddleware,
  uploadMiddleware.single("image"), // Expect a single image file with field name "image"
  uploadImageController
);

// ===============================
// Route to get all uploaded images
// ===============================
// GET /api/image/get
// Only authenticated users can access this
router.get("/get", authMiddleware, fetchImagesController);
router.delete(
  "/delete/:id",
  authMiddleware,
  adminMiddleware,
  deleteImageController
);
router.put(
  "/update/:id",
  authMiddleware,
  adminMiddleware,
  updateImageController
);
router.get(
  "/get/:id",
  authMiddleware,
  getSingleImageController
);
router.post("/like/:id", authMiddleware, toggleLike);
router.post('/comment/:id',authMiddleware,commentController);
router.delete('/comment/:imageId/:commentId',authMiddleware,deleteComment);


// Export the router to use in main server file (e.g. server.js or app.js)
module.exports = router;
