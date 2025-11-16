const jwt=require("jsonwebtoken");
const config=require("../config");
const userMiddleware=(req,res,next)=>{
    const authHeader=req.headers.authorization;
    if(!authHeader||!authHeader.startsWith("Bearer ")){
        return res.status(401).json({error:"token not provided"});
    }
    const token=authHeader.split(" ")[1];
    console.log(token)
    try {
        const decoded=jwt.verify(token,config.JWT_USER_PASSWORD)
        console.log(decoded);
        req.userId=decoded.id;
        console.log(req.userId)
        next();
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:"Invalid token or expired"});
    }
}
module.exports=userMiddleware;