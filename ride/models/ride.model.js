import mongoose from "mongoose";

const rideSchema = new mongoose.Schema(
  {
    captainId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    pickup: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["requested", "accepted", "completed", "cancelled"],
      default: "requested",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Ride", rideSchema);
