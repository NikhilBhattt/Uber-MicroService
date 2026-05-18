import mongoose, { Schema } from "mongoose";

const captainSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Captain", captainSchema);
