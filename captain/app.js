import { configDotenv } from "dotenv";
configDotenv();
import express from "express";
import db from "./db/db.js";
import { connectToMQ } from "./service/rabbitmq.js";
import captainRoutes from "./routes/captain.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

await db();
await connectToMQ();

app.use("/", captainRoutes);

export default app;
