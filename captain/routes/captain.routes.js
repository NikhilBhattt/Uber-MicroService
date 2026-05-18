import { Router } from "express";
import {
  registerCaptain,
  loginCaptain,
  profile,
  logout,
  toggleAvailability,
  waitForRideRequests,
} from "../controllers/captain.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", registerCaptain);
router.post("/login", loginCaptain);
router.get("/profile", authMiddleware, profile);
router.get("/logout", authMiddleware, logout);
router.patch("/toggle-availability", authMiddleware, toggleAvailability);
router.get("/new-rides", authMiddleware, waitForRideRequests);

export default router; 