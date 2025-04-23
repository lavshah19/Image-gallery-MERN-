
const isAdminUser=(req,res,next)=>{
    if(req.userInfo.role!=='admin'){
        return res.status(403).json({
            success:false,
            message:'access denies! Admin rights required'
        })
        
    }
    next();
}
module.exports=isAdminUser;