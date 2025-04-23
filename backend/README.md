# 📸 auth-image-api-node

A secure Node.js and Express-based REST API for image upload, storage, and management. Features user authentication, admin-only image upload using Cloudinary, and access-protected routes.

## 🚀 Features

- User Registration and Login with JWT Authentication
- Role-based Access Control (Admin/User)
- Image Upload using `multer`
- Store Images on Cloudinary
- Image Metadata Stored in MongoDB (via Mongoose)
- Secure API Endpoints
- Fetch and Delete Uploaded Images
- Middleware for Auth, Admin Check, and File Handling

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **JWT (JSON Web Token)**
- **Cloudinary**
- **Multer**
- **dotenv**





## 🔐 Environment Variables

Create a `.env` file in your root directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret


.

📦 Installation
git clone https://github.com/your-username/auth-image-api-node.git
cd auth-image-api-node
npm install
npm run dev

🧪 API Endpoints
Method	Route	         Description	          Auth Required
POST	/register	   Register a new user	        ❌
POST	/login	      Login and get JWT token	    ❌
POST	/upload  	  Upload an image (admin only)	✅
GET	    /get   	     Get all uploaded images	    ✅
DELETE	/delete/:id	 Delete an image (owner only)	✅


📝 License
This project is licensed under the MIT License.


💡 Want to contribute?
Feel free to fork and open PRs to improve or add new features!
