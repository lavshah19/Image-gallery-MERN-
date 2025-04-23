const mongoose=require('mongoose');

const connectTODB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("mongodb is connect successflly");
        
    }catch(e){
        console.log(`mongodb connection failed`,e);
        process.exit(1);
        
    }
}
module.exports=connectTODB;


