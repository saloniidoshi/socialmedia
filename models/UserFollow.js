const mongoose = require("mongoose");

const userFollowSchema = new mongoose.Schema({
  followerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  followingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  respondedAt: {
    type: Date,
    default: null,
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

// Prevent duplicate follow records
userFollowSchema.index(
  { followerId: 1, followingId: 1 },
  { 
    unique: true,
    partialFilterExpression: { isDeleted: false }
  }
);
module.exports = mongoose.model("UserFollow", userFollowSchema);
