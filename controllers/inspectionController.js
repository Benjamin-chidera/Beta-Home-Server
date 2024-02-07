const Inspection = require ('../models/inspection')

const  createInspection = async (req, res) => {
    try {
        const inspection = await Inspection.create({...req.body})
        res.status(201).json({success: true, inspection})
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}

const getAllInspection = async (req,res) => {
    try {
        const inspection = await Inspection.find().sort("-createdAt")
        res.status(200).json({success: true, inspection})
    } catch (error) {
        res.status(500).json({err: "internal server error"})
    }
}

module.exports = { createInspection, getAllInspection}