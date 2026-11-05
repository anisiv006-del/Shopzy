const Product = require("../models/Product");
const Review = require("../models/Review");
const { validObjectId } = require("../middleware/validationMiddleware");

async function refreshProductRating(productId) {
  const stats = await Review.aggregate([
    { $match: { productId } },
    {
      $group: {
        _id: "$productId",
        rate: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);
  const rating = stats[0] || { rate: 0, count: 0 };
  await Product.findByIdAndUpdate(productId, {
    $set: {
      "rating.rate": Number(rating.rate.toFixed(1)),
      "rating.count": rating.count,
    },
  });
}

async function listReviews(req, res) {
  if (!validObjectId(req.params.id))
    return res.status(400).json({ message: "Invalid product ID" });
  const reviews = await Review.find({ productId: req.params.id })
    .populate("userId", "username")
    .sort({ createdAt: -1 });
  res.json(reviews);
}

async function createReview(req, res) {
  const { id } = req.params;
  const { rating, comment } = req.body;
  if (
    !validObjectId(id) ||
    !Number.isInteger(Number(rating)) ||
    Number(rating) < 1 ||
    Number(rating) > 5 ||
    typeof comment !== "string" ||
    !comment.trim() ||
    comment.trim().length > 1000
  ) {
    return res.status(400).json({ message: "Invalid review" });
  }
  const product = await Product.findById(id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  try {
    const review = await Review.create({
      productId: id,
      userId: req.user.userId,
      rating: Number(rating),
      comment: comment.trim(),
    });
    await refreshProductRating(product._id);
    res.status(201).json({ message: "Review added", review });
  } catch (error) {
    if (error.code === 11000)
      return res
        .status(409)
        .json({ message: "You already reviewed this product" });
    res.status(500).json({ message: "Unable to add review" });
  }
}

async function deleteReview(req, res) {
  if (!validObjectId(req.params.reviewId))
    return res.status(400).json({ message: "Invalid review ID" });
  const review = await Review.findOneAndDelete({
    _id: req.params.reviewId,
    userId: req.user.userId,
  });
  if (!review) return res.status(404).json({ message: "Review not found" });
  await refreshProductRating(review.productId);
  res.json({ message: "Review deleted" });
}

module.exports = { listReviews, createReview, deleteReview };
