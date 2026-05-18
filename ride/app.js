import { configDotenv } from "dotenv";
configDotenv();
import express from "express";
import connectDB from "./db/db.js";
import rideRoutes from "./routes/ride.routes.js";
import { connectToMQ } from "./service/rabbitmq.js";

await connectDB();
await connectToMQ();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", rideRoutes);

export default app;
