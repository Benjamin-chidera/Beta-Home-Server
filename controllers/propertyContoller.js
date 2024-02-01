const PROPERTY = require("../models/property")
const cloudinary = require("cloudinary").v2
const fs = require("fs")

const handleAddProperty = async(req, res) => {
     const {title, location, price, propertyType, description, tags, propertyStatus, bathroom, bedroom, garage,squareFeet, name, phoneNumber, whatsappNumber} = req.body

    const video = req.files.video.tempFilePath
    const images = req.files.images
    const avatar = req.files.avatar.tempFilePath


    try {
        const avatarResult = await cloudinary.uploader.upload(avatar, {
            use_filename: true, // this will maintain the file name of the image
            folder: "betaHome" // the name of the folder the images will be saving 
        })
        //delete temp file
        fs.unlinkSync(req.files.avatar.tempFilePath)

        //images upload
        const imageUploadPromises = images.map(async(image) => { // we are mapping it first because we are going to have more than one image
            const result = await cloudinary.uploader.upload(image.tempFilePath, {
                use_filename: true,
                folder: "betaHome"
            })
            fs.unlinkSync(image.tempFilePath)
            return result.secure_url
        })

        const uploadedImages = await Promise.all(imageUploadPromises)
        // image upload

        // video upload
        const videoResult = await cloudinary.uploader.upload(video, {
            resource_type: "video",
            folder: "betahomevideos"
        }) 

        fs.unlinkSync(req.files.video.tempFilePath)

        const media = {
            images: [...uploadedImages],
            video: videoResult.secure_url
        }


        const salesSupport = {
            name, phoneNumber, whatsappNumber,avatar: avatarResult.secure_url
        }


        const property = await PROPERTY.create({
            title, location, price, propertyType, description, tags, propertyStatus, bathroom, bedroom, garage,squareFeet, media, salesSupport
        })
        res.status(201).json({success: true, property})
        
    } catch (error) {
        res.status(400).json(error)
    }
}


const handleGetAllProperty = async(req, res) => {
    
    try {
        const property = await PROPERTY.find().sort("-createdAt")
        res.status(200).json({success: true, property})
    } catch (error) {
        res.status(404).json(error)
    }
}

const handleGetRecentProperty = async(req, res) => {
    try {
        const recentProperties = await PROPERTY.find().sort("-createdAt").limit(3)
        res.status(200).json({success: true, properties: recentProperties})
    } catch (error) {
        res.status(404).json(error)
    }
}

const GetASingleProperty = async(req, res) => {
    const {propertyId} = req.params

    try {
        const property = await PROPERTY.findById({_id: propertyId})
        const propertyType = property.propertyType

        const similarProperty = await PROPERTY.find({propertyType}).limit(3)
        res.status(200).json({success: true, property,similarProperty})
    } catch (error) {
        res.status(404).json(error)
    }
}

const handleEditProperty = async(req, res) => {
    res.send("handle Edit Property")
}

const handleDeleteProperty = async(req, res) => {
    const {propertyId} = req.params

    try {
        const property = await PROPERTY.findByIdAndDelete({_id: propertyId})
        res.status(200).json({success: true, property})
    } catch (error) {
        res.status(404).json(error)
    }
}

module.exports = {handleAddProperty, handleGetAllProperty, handleGetRecentProperty, GetASingleProperty, handleEditProperty, handleDeleteProperty}