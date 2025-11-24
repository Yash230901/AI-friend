const express = require('express')
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser")
const cors = require("cors")
const app = express()
dotenv.config();
const port = process.env.PORT || 4001;
const MONGO_URI = process.env.MONGO_URI

const userRoutes = require("./routes/user")
const promptRoutes = require("./routes/prompt.js")
//mongodbConnection

mongoose.connect(MONGO_URI).then(() => console.log("Database connected")).catch((err) => console.log(err))

//middlewares
app.use(
    cors({
        origin: process.env.frontend_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
)
app.use(express.json());
app.use(cookieParser())
//routes
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/deepseekai", promptRoutes)

app.get("/", (req, res) => {
    res.send("hi from backend")
})

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})
