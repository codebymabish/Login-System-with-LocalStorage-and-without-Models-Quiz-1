import express from "express";
import {
  signup,
  login,
  getCurrentUser,
  verifyToken,
} from "../controllers/authController.js";
import { verifyToken as authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/verify", authMiddleware, verifyToken);
router.get("/current-user", authMiddleware, getCurrentUser);
// new: lightweight token verify endpoint used by frontend
router.get("/verify", protect, (req, res) => {
  return res.json({ ok: true, user: req.user });
});
export default router;
