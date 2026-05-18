import bcypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Blacklist from "../models/blacklist.model.js";

const authMiddleware = async (req, res, next) => {
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

  const isBlacklisted = await Blacklist.findOne({ token });

  if (isBlacklisted) {
    return res.status(401).json({ message: "UnAuthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
export default authMiddleware;
