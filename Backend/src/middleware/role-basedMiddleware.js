import express from "express";
import {
  signup,
  login,
  getCurrentUser,
} from "../controllers/authController.js";
import { protect } from "./authMiddleware.js";
import { hasRole, hasPermission } from "./roleAuth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, getCurrentUser);


router.post(
  "/quiz",
  protect,
  hasRole(["teacher", "admin"]),
  hasPermission(["create_quiz"]),
  (req, res) => res.json({ message: "Quiz create endpoint (stub)" })
);

router.delete(
  "/quiz/:id",
  protect,
  hasRole(["teacher", "admin"]),
  hasPermission(["delete_quiz"]),
  (req, res) => res.json({ message: `Quiz ${req.params.id} deleted (stub)` })
);

export default router;
