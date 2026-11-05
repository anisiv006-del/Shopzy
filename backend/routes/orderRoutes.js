const express = require("express");
const router = express.Router();

const {
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Customer: View own orders
router.get("/my-orders", authMiddleware, getMyOrders);

// Customer: View a particular order
router.get("/:id", authMiddleware, getOrderById);

// Admin: View all orders
router.get("/", authMiddleware, roleMiddleware("admin"), getAllOrders);

// Admin: Update order status
router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware("admin"),
  updateOrderStatus,
);

module.exports = router;
