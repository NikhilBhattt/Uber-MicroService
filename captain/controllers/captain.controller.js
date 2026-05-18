import Captain from "../models/captain.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import BlacklistModel from "../models/blacklist.model.js";

import { subscribeToQueue } from "../service/rabbitmq.js";

export const registerCaptain = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingCaptain = await Captain.findOne({ email });
  if (existingCaptain) {
    return res.status(400).json({ message: "Captain already exists" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newCaptain = new Captain({ name, email, password: hashedPassword });
    await newCaptain.save();
    const token = jwt.sign({ id: newCaptain._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.status(201).json({
      token,
      captain: {
        id: newCaptain._id,
        name: newCaptain.name,
        email: newCaptain.email,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error occurred while registering Captain" });
  }
};

export const loginCaptain = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const captain = await Captain.findOne({ email });
    if (!captain) {
      return res.status(404).json({ message: "Captain not found" });
    }
    const isMatch = await bcrypt.compare(password, captain.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: captain._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.status(200).json({
      token,
      captain: {
        id: captain._id,
        name: captain.name,
        email: captain.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error occurred while logging in" });
  }
};

export const profile = async (req, res) => {
  try {
    const captain = await Captain.findById(req.captain._id).select("-password");
    if (!captain) {
      return res.status(404).json({ message: "Captain not found" });
    }
    return res.status(200).json({ captain });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error occurred while fetching profile" });
  }
};

export const logout = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Authorization header is required" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token is required" });
  }
  try {
    await BlacklistModel.create({ token });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error occurred while logging out" });
  }
};

export const toggleAvailability = async (req, res) => {
  try {
    const captain = await Captain.findById(req.captain._id);

    captain.isAvailable = !captain.isAvailable;
    await captain.save();

    return res
      .status(200)
      .json({ message: "Availability updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error occurred while toggling availability" });
  }
};

const pendingRequests = [];

export const waitForRideRequests = async (req, res) => {
  req.setTimeout(30000, () => {
    res.status(204).json({ msg: "No new rides!" }); // No content, just end the response
  });

  pendingRequests.push(res);

  req.on("close", () => {
    const index = pendingRequests.indexOf(res);

    if (index !== -1) {
      pendingRequests.splice(index, 1);
    }
  });
};

subscribeToQueue("ride_created", async (msg) => {
  const rideData = JSON.parse(msg);

  pendingRequests.forEach((res) => {
    if (!res.headersSent) {
      res.json({ data: rideData });
    }
  });

  pendingRequests.length = 0; // Clear the pending requests array
});
