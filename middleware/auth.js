const jwt = require("jsonwebtoken")

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization
    
   try {
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(400).json({msg: "Invalid Auth"})
    }

    const token = authHeader.split(" ")[1]

    const payload = jwt.verify(token, process.env.TOKEN)

    req.user = {
            userId: payload.userId,
            role: payload.role
    }
    next()
   } catch (error) {
    console.log(error);
    return res.status(403).json({err: "auth failed"})
   }
}

const permission = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({err: "unauthorized to perform this action"})
        }
        next()
    } 
}

module.exports = {auth, permission}