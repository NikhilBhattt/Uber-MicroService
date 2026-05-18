import mongoose from "mongoose";

const blacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
});

const BlacklistModel = mongoose.model("Blacklist", blacklistSchema);
export default BlacklistModel;
