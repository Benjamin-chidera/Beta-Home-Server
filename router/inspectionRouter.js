const router = require("express").Router()
const {createInspec, getAllInspec} = require("../controllers/inspectionController")
const {auth, permission} = require("../middleware/auth")

router.route("/inspection").get(auth,permission("admin"),getAllInspec).post( auth, permission('user'),createInspec)

module.exports = router