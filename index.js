require("dotenv").config()
const express = require("express")
const app = express()
const PORT = process.env.PORT || 5000
const cors = require("cors")
const mongoose = require("mongoose")
const profileRouter = require("./router/profileRouter")
const inspectionRouter = require("./router/inspectionRouter")


app.use(express.json())
app.use(cors())


app.get("/", (req, res) => {
    res.send("home page")
})

app.use("/api/v1", profileRouter)
app.use("/api/v1", inspectionRouter)
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