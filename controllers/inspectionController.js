const INSPECTION = require("../models/inspection")

const createInspec = async(req, res) => {
   const {firstName, lastName, email, phoneNumber, location, inspectionDate, inspectionTime} = req.body

   try {
    const inspect = await INSPECTION.create(req.body)
    res.status(201).json({msg: "success", inspect})
   } catch (error) {
    res.status(500).json({Error: error.message})
   }
}

const getAllInspec = async(req, res) => {
   try {
    const inspec = await INSPECTION.find().sort("-createdAt")
    res.status(200).json({msg: "success", inspec})
   } catch (error) {
    res.status(500).json({Error: error.message})
   }
}

module.exports = {createInspec, getAllInspec}