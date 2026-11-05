const express = require("express");

const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");

const checkRole = require("../middleware/roleMiddleware");

const {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const {
  listReviews,
  createReview,
  deleteReview,
} = require("../controllers/reviewController");

// JWT authentication for all product routes
router.use(authenticateUser);

// Both admin and user can view products
router.get("/", getProducts);

router.get("/:id", getProductById);

router.get("/:id/reviews", listReviews);
router.post("/:id/reviews", createReview);
router.delete("/:id/reviews/:reviewId", deleteReview);

// Only admin can modify products
router.post("/", checkRole("admin"), addProduct);

router.put("/:id", checkRole("admin"), updateProduct);

router.delete("/:id", checkRole("admin"), deleteProduct);

module.exports = router;
