require("dotenv").config();
const express=require('express');
const app=express();
const cors = require("cors");
const connectTODB=require("./database/db");
const  authrouter = require("./router/auth-routes");
const  homerouter = require("./router/home-routes");
const  adminrouter = require("./router/admin-routes");
const uploadImageRoutes=require(".//router/image-routes")
//conect to database
const PORT=process.env.PORT || 3000;


connectTODB();
// Enable CORS for all routes and origins
app.use(cors());

app.use(express.json());
app.use('/api/auth',authrouter);
app.use('/api/home',homerouter);
app.use('/api/admin',adminrouter);
app.use('/api/image',uploadImageRoutes);

app.listen(PORT,()=>{
    console.log(`server is running in the server to port ${PORT}`);
    
})
