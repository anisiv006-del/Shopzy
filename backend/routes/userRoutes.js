const express = require("express");

const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");

const checkRole = require("../middleware/roleMiddleware");

const {
  getMyProfile,
  getUserById,
  updateProfile,
  patchProfile,
  deleteAccount,
  getAllUsers,
} = require("../controllers/userController");
const {
  listAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  getWishlist,
  toggleWishlist,
  deleteUser,
} = require("../controllers/featureController");

// All routes below require JWT authentication
router.use(authenticateUser);

// Get logged-in user's profile
router.get("/me", getMyProfile);

// Update complete profile
router.put("/me", updateProfile);

// Update selected profile fields
router.patch("/me", patchProfile);

// Delete own account
router.delete("/me", deleteAccount);

router.get("/me/addresses", listAddresses);
router.post("/me/addresses", addAddress);
router.put("/me/addresses/:addressId", updateAddress);
router.delete("/me/addresses/:addressId", deleteAddress);

router.get("/me/wishlist", getWishlist);
router.post("/me/wishlist/:productId", toggleWishlist);

// Admin can list all users
router.get("/", checkRole("admin"), getAllUsers);
router.delete("/:id", checkRole("admin"), deleteUser);

// Get user by ID with BOLA protection
router.get("/:id", getUserById);

module.exports = router;
