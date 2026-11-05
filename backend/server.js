require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const orderRoutes = require("./routes/orderRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const { rejectMongoOperators } = require("./middleware/validationMiddleware");

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  }),
);

app.use(express.json({ limit: "10kb" }));

// NoSQL injection input protection
app.use(rejectMongoOperators);

// Test route
app.get("/", (req, res) => {
  res.send("Shopping Backend Running");
});

// Authentication routes
app.use("/api", authRoutes);

// User routes
app.use("/api/users", userRoutes);

// Product routes
app.use("/api/products", productRoutes);

// Order routes
app.use("/api/orders", orderRoutes);

// Category routes
app.use("/api/categories", categoryRoutes);

// Payment routes
app.use("/api/payments", paymentRoutes);

// Invalid route
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: "Internal Server Error",
  });
});

// Start server after database connection
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
