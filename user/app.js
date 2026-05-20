import { configDotenv } from "dotenv";
configDotenv();
import express from "express";
import db from "./db/db.js";
import { connectToMQ } from "./service/rabbitmq.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database connection
await db();

// Initialize RabbitMQ connection
await connectToMQ();

// User-related routes
app.use("/", userRoutes);

export default app;
