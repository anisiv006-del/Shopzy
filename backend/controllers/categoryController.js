const Product = require("../models/Product");

// Get all unique categories
const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");

    res.status(200).json({
      categories: categories,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to fetch categories",
    });
  }
};

// Get products by category
const getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category;

    const products = await Product.find({
      category: category,
    });

    res.status(200).json({
      category: category,
      products: products,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to fetch products",
    });
  }
};

module.exports = {
  getCategories,
  getProductsByCategory,
};
