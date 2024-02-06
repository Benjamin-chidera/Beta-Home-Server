const router = require("express").Router()
const {handleAddProperty, handleGetAllProperty, handleGetRecentProperty, GetASingleProperty, handleEditProperty, handleDeleteProperty, handleFeaturedProperty} = require("../controllers/propertyContoller")

router.route("/").get(handleGetAllProperty).post(handleAddProperty)
router.get("/recent", handleGetRecentProperty)
router.get("/featured", handleFeaturedProperty)
router.route("/:propertyId").get(GetASingleProperty).patch(handleEditProperty).delete(handleDeleteProperty)


module.exports = router