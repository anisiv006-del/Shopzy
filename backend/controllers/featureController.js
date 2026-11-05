const User = require("../models/User");
const Product = require("../models/Product");
const { validObjectId } = require("../middleware/validationMiddleware");

function addressPayload(body) {
  const fields = ["label", "name", "phone", "line", "city", "pincode"];
  if (
    Object.keys(body).some((key) => !fields.includes(key)) ||
    fields.some((key) => typeof body[key] !== "string" || !body[key].trim())
  )
    return null;
  return Object.fromEntries(fields.map((key) => [key, body[key].trim()]));
}

async function listAddresses(req, res) {
  const user = await User.findById(req.user.userId).select("addresses");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user.addresses);
}

async function addAddress(req, res) {
  const address = addressPayload(req.body);
  if (!address) return res.status(400).json({ message: "Invalid address" });
  const user = await User.findByIdAndUpdate(
    req.user.userId,
    { $push: { addresses: address } },
    { new: true },
  );
  if (!user) return res.status(404).json({ message: "User not found" });
  res
    .status(201)
    .json({ message: "Address saved", address: user.addresses.at(-1) });
}

async function updateAddress(req, res) {
  if (!validObjectId(req.params.addressId))
    return res.status(400).json({ message: "Invalid address ID" });
  const address = addressPayload(req.body);
  if (!address) return res.status(400).json({ message: "Invalid address" });
  const user = await User.findOneAndUpdate(
    { _id: req.user.userId, "addresses._id": req.params.addressId },
    {
      $set: Object.fromEntries(
        Object.entries(address).map(([key, value]) => [
          `addresses.$.${key}`,
          value,
        ]),
      ),
    },
    { new: true },
  );
  if (!user) return res.status(404).json({ message: "Address not found" });
  res.json({
    message: "Address updated",
    address: user.addresses.id(req.params.addressId),
  });
}

async function deleteAddress(req, res) {
  if (!validObjectId(req.params.addressId))
    return res.status(400).json({ message: "Invalid address ID" });
  const user = await User.findOneAndUpdate(
    { _id: req.user.userId, "addresses._id": req.params.addressId },
    { $pull: { addresses: { _id: req.params.addressId } } },
    { new: true },
  );
  if (!user) return res.status(404).json({ message: "Address not found" });
  res.json({ message: "Address deleted" });
}

async function getWishlist(req, res) {
  const user = await User.findById(req.user.userId).populate("wishlist");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user.wishlist);
}

async function toggleWishlist(req, res) {
  if (!validObjectId(req.params.productId))
    return res.status(400).json({ message: "Invalid product ID" });
  const product = await Product.findById(req.params.productId);
  if (!product) return res.status(404).json({ message: "Product not found" });
  const user = await User.findById(req.user.userId).select("wishlist");
  if (!user) return res.status(404).json({ message: "User not found" });
  const exists = user.wishlist.some(
    (id) => id.toString() === req.params.productId,
  );
  user.wishlist = exists
    ? user.wishlist.filter((id) => id.toString() !== req.params.productId)
    : [...user.wishlist, product._id];
  await user.save();
  res.json({
    message: exists ? "Removed from wishlist" : "Added to wishlist",
    wishlisted: !exists,
  });
}

async function deleteUser(req, res) {
  if (!validObjectId(req.params.id))
    return res.status(400).json({ message: "Invalid user ID" });
  if (req.params.id === req.user.userId)
    return res
      .status(400)
      .json({ message: "Use account deletion for your own account" });
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User deleted" });
}

module.exports = {
  listAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  getWishlist,
  toggleWishlist,
  deleteUser,
};
