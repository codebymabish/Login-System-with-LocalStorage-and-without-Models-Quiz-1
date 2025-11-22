import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { z } from "zod";
import UserModel from "../models/userModel.js";

// Server-side validation schemas
const signupSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["student", "teacher"]),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// 🔹 Generate JWT Token
const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || "secretkey", {
    expiresIn: "1h",
  });
};

// 🟢 SIGNUP Controller (no manual hashing)
export const signup = async (req, res) => {
  try {
    // Server-side validation
    const validatedData = signupSchema.parse(req.body);

    // Check if user exists
    const existingUser = await UserModel.findOne({
      email: validatedData.email,
    });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create user
    const user = await UserModel.create(validatedData);

    res.status(201).json({
      message: "Registration successful, please login now",
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Validation error", errors: err.errors });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// 🟡 LOGIN Controller
export const login = async (req, res) => {
  try {
    // Validate input
    const validatedData = loginSchema.parse(req.body);

    // Find user by email
    const user = await UserModel.findOne({ email: validatedData.email });

    // ❌ USER NOT FOUND
    if (!user) {
      return res.status(404).json({ message: "USER_NOT_FOUND" });
    }

    // ❌ WRONG PASSWORD
    const isMatch = await bcrypt.compare(validatedData.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "INVALID_PASSWORD" });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: "VALIDATION_ERROR", errors: err.errors });
    }
    res.status(500).json({ message: "SERVER_ERROR" });
  }
};


// 🟣 GET CURRENT USER Controller
export const getCurrentUser = async (req, res) => {
  try {
    const id = req.userId;
    if (!id) {
      return res.status(400).json({ message: "User ID missing in request" });
    }

    const user = await UserModel.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error("Get current user error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🔵 VERIFY TOKEN Controller
export const verifyToken = async (req, res) => {
  try {
    // If we get here, it means the token is valid (middleware already verified it)
    const user = await UserModel.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      valid: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
