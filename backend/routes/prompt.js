const express=require("express")
const {sendPrompt}=require("../controller/prompt.js")
const userMiddleware=require("../middleware/prompt.js")
const router=express.Router();

router.post("/prompt",userMiddleware,sendPrompt)

module.exports=router
