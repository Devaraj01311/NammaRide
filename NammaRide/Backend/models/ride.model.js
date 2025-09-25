const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    captain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "captain",
    },
    pickup: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    fare: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "ongoing", "completed", "cancelled"],
      default: "pending",
    },
    duration: {
      type: Number, // minutes (from Google API)
    },
    distance: {
      type: Number, // km (from Google API)
    },
    paymentID: {
      type: String,
    },
    orderId: {
      type: String,
    },
    signature: {
      type: String,
    },
    otp: {
      type: String,
      select: false,
      required: true,
    },

    // 🔹 Track times
    rideRequestedAt: {
      type: Date,
      default: Date.now,
    },
    rideAcceptedAt: {
      type: Date,
    },
    rideStartedAt: {
      type: Date,
    },
    rideEndedAt: {
      type: Date,
    },
  },
  { timestamps: true } // adds createdAt, updatedAt
);

module.exports = mongoose.model("ride", rideSchema);
