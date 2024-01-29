const router = require("express").Router()
const {createInspec, getAllInspec} = require("../controllers/inspectionController")
const {auth, permission} = require("../middleware/auth")

router.route("/inspection").get(auth,permission("admin"),getAllInspec).post( auth,createInspec)

module.exports = router