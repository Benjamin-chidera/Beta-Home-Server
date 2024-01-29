const PROFILE = require("../models/profile")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


const handleRegister = async(req, res) => {
    const {firstName, lastName, email, password, role} = req.body

   try {
    const userExist = await PROFILE.findOne({email})

    if (userExist) {
        return res.status(400).json({Err: "Email already in use"})
    }

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    const user = await PROFILE.create({firstName, lastName, email, password: hashPassword, role})

    res.status(201).json({ msg: "success",user: {
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
    }})
   } catch (error) {
    res.status(400).json({Err: error.message})
   }
}

const handleLogin = async(req, res) => {
   const {email, password} = req.body

   if (!email || !password) {
    return res.status(400).json({msg: "fill all fields"})
   }

   try {
    const user = await PROFILE.findOne({email})

    if (!user) {
        return res.status(404).json({msg: "Credentials invalid"})
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
        return res.status(404).json({msg: "Credentials invalid"})
    }

    const token = jwt.sign({userId: user._id, role: user.role}, process.env.TOKEN, {expiresIn: "2h"})

    res.status(200).json({msg: "success", user: {
        firstName: user.firstName,
        email: user.email,
        role: user.role,
        token
    }})
   } catch (error) {
    res.status(400).json({Err: error.message})
   }
}

module.exports = {handleRegister, handleLogin}