const router = require("express").Router();
const {
  getAllInspection,
  createInspection,
} = require("../controllers/inspectionController");
const { authentication, requirePermission } = require("../middlewares/auth");

router
  .route("/inspection")
  .get(authentication, requirePermission("admin"), getAllInspection)
  .post(authentication, createInspection);

module.exports = router;
