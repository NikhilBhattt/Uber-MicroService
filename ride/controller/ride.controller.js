import { publishToQueue } from "../service/rabbitmq.js";
import Ride from "../models/ride.model.js";

export const createRide = async (req, res) => {
  const { pickup, destination } = req.body;

  if (!pickup || !destination) {
    return res
      .status(400)
      .json({ message: "Pickup and destination are required" });
  }

  try {
    const newRide = await Ride.create({
      userId: req.user._id,
      pickup,
      destination,
    });

    await publishToQueue(
      "ride_created",
      JSON.stringify({ action: "ride_created", newRide }),
    );

    return res
      .status(201)
      .json({ message: "Ride created successfully", ride: newRide });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error occurred while creating ride" });
  }
};
