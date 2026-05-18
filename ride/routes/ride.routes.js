import { Router } from "express";
import { createRide } from "../controller/ride.controller.js";
import authMiddleware from "../middleware/auth.middleware.js"

const router = Router();

router.post("/create-ride", authMiddleware, createRide);

export default router;
