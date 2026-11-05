const User = require("../models/User");
const bcrypt = require("bcryptjs");

const {
  validEmail,
  validObjectId,
} = require("../middleware/validationMiddleware");

// GET MY PROFILE

async function getMyProfile(req, res) {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      username: user.username,
      emailId: user.emailId,
      age: user.age,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching profile",
    });
  }
}

// GET USER BY ID - BOLA PROTECTION

async function getUserById(req, res) {
  try {
    const id = req.params.id;

    if (!validObjectId(id)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    // Only owner or admin can access the profile

    if (req.user.userId !== id && req.user.role !== "admin") {
      return res.status(403).json({
        message: "You cannot access another user's data",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      username: user.username,
      emailId: user.emailId,
      age: user.age,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user",
    });
  }
}

// PUT - UPDATE COMPLETE PROFILE

async function updateProfile(req, res) {
  try {
    const allowedFields = ["username", "emailId", "age", "password"];

    const fields = Object.keys(req.body);

    if (
      fields.length === 0 ||
      fields.some((field) => !allowedFields.includes(field))
    ) {
      return res.status(400).json({
        message: "Invalid update fields",
      });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const { username, emailId, age, password } = req.body;

    if (username !== undefined) {
      if (typeof username !== "string" || username.trim().length < 2) {
        return res.status(400).json({
          message: "Invalid username",
        });
      }

      user.username = username.trim();
    }

    if (emailId !== undefined) {
      if (!validEmail(emailId)) {
        return res.status(400).json({
          message: "Invalid email",
        });
      }

      const email = emailId.trim().toLowerCase();

      const existingUser = await User.findOne({
        emailId: email,
        _id: { $ne: user._id },
      });

      if (existingUser) {
        return res.status(409).json({
          message: "Email already registered",
        });
      }

      user.emailId = email;
      user.isEmailVerified = false;
    }

    if (age !== undefined) {
      if (
        !Number.isInteger(Number(age)) ||
        Number(age) < 1 ||
        Number(age) > 120
      ) {
        return res.status(400).json({
          message: "Invalid age",
        });
      }

      user.age = Number(age);
    }

    if (password !== undefined) {
      if (
        typeof password !== "string" ||
        password.length < 8 ||
        password.length > 72
      ) {
        return res.status(400).json({
          message: "Password must be 8 to 72 characters",
        });
      }

      user.password = await bcrypt.hash(password, 12);
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    res.status(500).json({
      message: "Profile update failed",
    });
  }
}

// PATCH - UPDATE SELECTED FIELDS

async function patchProfile(req, res) {
  return updateProfile(req, res);
}

// DELETE MY ACCOUNT

async function deleteAccount(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Account deletion failed",
    });
  }
}

// ADMIN - GET ALL USERS

async function getAllUsers(req, res) {
  try {
    const users = await User.find().select(
      "username emailId age role isEmailVerified",
    );

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching users",
    });
  }
}

module.exports = {
  getMyProfile,
  getUserById,
  updateProfile,
  patchProfile,
  deleteAccount,
  getAllUsers,
};
