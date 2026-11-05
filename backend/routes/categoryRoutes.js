const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getCategories,
  getProductsByCategory,
} = require("../controllers/categoryController");

const router = express.Router();

router.get("/", authMiddleware, getCategories);
router.get("/:category", authMiddleware, getProductsByCategory);

module.exports = router;
