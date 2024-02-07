const router = require("express").Router();
const {
  handleAddProperty,
  handleGetAllProperties,
  handleGetRecentProperties,
  getASingleProperty,
  handleEditProperty,
  handleDeleteProperty,
  handleFeaturedProperties,
} = require("../controllers/propertyController");

router.route("/").get(handleGetAllProperties).post(handleAddProperty);
router.get("/recent", handleGetRecentProperties);
router.get("/featured", handleFeaturedProperties)
router
  .route("/:propertyId")
  .get(getASingleProperty)
  .patch(handleEditProperty)
  .delete(handleDeleteProperty);
  
module.exports = router;
