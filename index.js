require("dotenv").config()
const express = require("express")
const app = express()
const PORT = process.env.PORT || 5000
const cors = require("cors")
const mongoose = require("mongoose")
const fileUpload = require("express-fileupload")
const cloudinary = require("cloudinary").v2
const profileRouter = require("./router/profileRouter")
const inspectionRouter = require("./router/inspectionRouter")
const propertyRouter = require("./router/propertyRoute")


//cloudinary config 
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

app.use(fileUpload({useTempFiles: true}))
app.use(express.json())
app.use(cors())


app.get("/", (req, res) => {
    res.send("home page")
})

app.use("/api/v1", profileRouter)
app.use("/api/v1", inspectionRouter)
app.use("/api/v1/property", propertyRouter)
app.use((req, res) => {
    res.status(404).send("not found")
})

const server = async() => {
    try {
        await mongoose.connect(process.env.URL, {dbName: "betaHome"})
        app.listen(PORT,(req, res) => {
            console.log("server is working " + PORT);
        })
    } catch (error) {
        
    }
}

server()