const Product = require("../models/Product");

// GET ALL PRODUCTS

async function getProducts(req, res) {
  try {
    const products = await Product.find();

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products",
    });
  }
}

// GET PRODUCT BY ID

async function getProductById(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id < 1) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const product = await Product.findOne({
      id: id,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching product",
    });
  }
}

// ADD PRODUCT - ADMIN ONLY

async function addProduct(req, res) {
  try {
    const allowedFields = [
      "id",
      "title",
      "price",
      "description",
      "category",
      "image",
      "quantity",
    ];

    const fields = Object.keys(req.body);

    if (fields.some((field) => !allowedFields.includes(field))) {
      return res.status(400).json({
        message: "Invalid product fields",
      });
    }

    const { id, title, price, description, category, image, quantity } =
      req.body;

    if (
      !Number.isSafeInteger(Number(id)) ||
      Number(id) < 1 ||
      typeof title !== "string" ||
      !title.trim() ||
      !Number.isFinite(Number(price)) ||
      Number(price) < 0 ||
      typeof description !== "string" ||
      typeof category !== "string" ||
      typeof image !== "string" ||
      (quantity !== undefined &&
        (!Number.isInteger(Number(quantity)) || Number(quantity) < 0))
    ) {
      return res.status(400).json({
        message: "Invalid product details",
      });
    }

    const product = await Product.create({
      id: Number(id),

      title: title.trim(),

      price: Number(price),

      description,

      category,

      image,

      quantity: quantity === undefined ? 0 : Number(quantity),
    });

    res.status(201).json({
      message: "Product added successfully",

      product,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Product ID already exists",
      });
    }

    res.status(500).json({
      message: "Error adding product",
    });
  }
}

// UPDATE PRODUCT - ADMIN ONLY

async function updateProduct(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id < 1) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const allowedFields = [
      "title",
      "price",
      "description",
      "category",
      "image",
      "quantity",
    ];

    const fields = Object.keys(req.body);

    if (
      fields.length === 0 ||
      fields.some((field) => !allowedFields.includes(field))
    ) {
      return res.status(400).json({
        message: "Invalid fields",
      });
    }

    const updates = {};

    for (const field of fields) {
      const value = req.body[field];

      if (
        ["title", "description", "category", "image"].includes(field) &&
        typeof value !== "string"
      ) {
        return res.status(400).json({
          message: "Invalid " + field,
        });
      }

      if (
        ["price", "quantity"].includes(field) &&
        (!Number.isFinite(Number(value)) || Number(value) < 0)
      ) {
        return res.status(400).json({
          message: "Invalid " + field,
        });
      }

      updates[field] = ["price", "quantity"].includes(field)
        ? Number(value)
        : value;
    }

    const product = await Product.findOneAndUpdate(
      { id: id },
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating product",
    });
  }
}

// DELETE PRODUCT - ADMIN ONLY

async function deleteProduct(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id < 1) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const product = await Product.findOneAndDelete({
      id: id,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting product",
    });
  }
}

module.exports = {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};
