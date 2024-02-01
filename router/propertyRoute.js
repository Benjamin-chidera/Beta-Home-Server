const router = require("express").Router()
const {handleAddProperty, handleGetAllProperty, handleGetRecentProperty, GetASingleProperty, handleEditProperty, handleDeleteProperty} = require("../controllers/propertyContoller")

router.route("/").get(handleGetAllProperty).post(handleAddProperty)
router.get("/recent", handleGetRecentProperty)
router.route("/:propertyId").get(GetASingleProperty).patch(handleEditProperty).delete(handleDeleteProperty)


module.exports = router