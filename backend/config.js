const dotenv=require("dotenv")

dotenv.config();

const JWT_USER_PASSWORD=process.env.JWT_PASSWORD;

module.exports={JWT_USER_PASSWORD}