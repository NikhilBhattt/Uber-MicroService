import { Router } from "express";
import {
  registerUser,
  loginUser,
  profile,
  logout,
} from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, profile);
router.get("/logout", authMiddleware, logout);


export default router;
