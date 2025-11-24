const User = require("../model/user")
const bcrypt = require("bcryptjs");
const config  = require("../config");
const jwt=require("jsonwebtoken")

const signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            return res.status(401).json({ errors: "user already exist" });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashPassword
        })
        await newUser.save();
        return res.status(201).json({ message: "User signup succeed" });
    } catch (error) {
        console.log("error in signup :", error);
        return res.status(500).json({ errors: "Error in signup" });
    }
}
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(403).json({ error: "Wrong credentials" });
        }
        const isCorrectPassword = await bcrypt.compare(password, user.password);
        if(!isCorrectPassword ){
            return res.status(403).json({ error: "Wrong credentials" });
        }
        //jwt code
        const token=jwt.sign({id:user._id},config.JWT_USER_PASSWORD,{
            expiresIn:"1d"
        });
        const cookieOptions={
            expires:new Date(Date.now()+24*60*60+1000),
            httpOnly:true,
            // secure:process.env.NODE_ENV==="production",
            secure:true,
            sameSite:"none"
        }
        res.cookie("jwt",token,cookieOptions);
        return res.status(201).json({ message: "user loggedin succeeded",user,token })

    } catch (error) {
        console.log("Error in login :", error);
        return res.status(500).json({ error: "error in login" });
    }
}
const logout =async (req, res) => {
    try {
        res.clearCookie("jwt");
        return res.status(201).json({message:"User logout succeeded"});
    } catch (error) {
        console.log("error occured while logout :",error);
        return res.status(500).json({error:"error occured"});
    }
    
}
module.exports = {
    signup,
    login,
    logout
}