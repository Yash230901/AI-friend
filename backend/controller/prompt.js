const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Prompt = require("../model/prompt");
const { response } = require("express");
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
async function run(content) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(content);
    console.log(result.response.text());
    return result.response.text();
}

const sendPrompt = async (req, res) => {
    let { content } = req.body;
    const userId = req.userId;

    if (!content || content.trim() === "") {
        return res.status(400).json({ message: "prompt is required" });
    }
    content = content.trim(" ");
    try {
        //saving user Prompt
        const userPrompt = await Prompt.create({
            userId,
            role: "user",
            content
        })
        //send content to run function for fetching prompt response
        let aiResult = await run(content);
        const aiMessage = await Prompt.create({
            userId,
            role: "assistant",
            content: aiResult
        })
        return res.status(201).json({ reply: aiResult });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "error occcured" })
    }
}

module.exports = {
    sendPrompt
}