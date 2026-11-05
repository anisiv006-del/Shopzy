const Order = require("../models/Order");

// Get logged-in user's order history
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.user.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch order history",
    });
  }
};

// Get a particular order
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch order",
    });
  }
};

// Admin: View all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "username emailId")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch orders",
    });
  }
};

// Admin: Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const allowedStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];

    const { orderStatus } = req.body;

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: orderStatus },
      { new: true, runValidators: true },
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json({
      message: "Order status updated",
      order: order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to update order status",
    });
  }
};

module.exports = {
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
