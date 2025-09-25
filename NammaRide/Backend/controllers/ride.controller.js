const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../models/ride.model');

// Create ride
module.exports.createRide = async (req, res) => {
  console.log(" createRide called with body:", req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation error:", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination, vehicleType } = req.body;

  try {
    const ride = await rideService.createRide({
      user: req.user._id,
      pickup,
      destination,
      vehicleType
    });

    console.log(" Ride created:", ride);
    res.status(201).json(ride);

    // Notify nearby captains
    (async () => {
      try {
        const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
        console.log("Pickup coordinates:", pickupCoordinates);

        const captainsInRadius = await mapService.getCaptainInTheRadius(
          pickupCoordinates.lat,
          pickupCoordinates.lng,
          2
        );
        console.log(`Captains found in radius: ${captainsInRadius.length}`);

        const rideWithUser = await rideModel.findById(ride._id).populate('user');
        if (!rideWithUser.user) {
          console.log("No user found for ride");
          return;
        }

        const rideData = {
          ...rideWithUser.toObject(),
          user: {
            _id: rideWithUser.user._id,
            fullname: `${rideWithUser.user.fullname.firstname} ${rideWithUser.user.fullname.lastname || ''}`,
            email: rideWithUser.user.email,
            socketId: rideWithUser.user.socketId
          },
          otp: "" // don’t expose OTP to captains
        };

        captainsInRadius.forEach(captain => {
          console.log(`Emitting new ride to captain ${captain._id}`);
          sendMessageToSocketId(captain.socketId, 'new-ride', rideData);
        });
      } catch (err) {
        console.error(" Error dispatching ride:", err.message);
      }
    })();

  } catch (err) {
    console.error(" createRide error:", err.message);
    return res.status(500).json({ message: err.message });
  }
};

// Get fare
module.exports.getFare = async (req, res) => {
  console.log("getFare called with query:", req.query);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation error:", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination } = req.query;

  try {
    const fare = await rideService.getFare(pickup, destination);
    console.log("Fare calculated:", fare);
    return res.status(201).json(fare);
  } catch (err) {
    console.error(" getFare error:", err.message);
    return res.status(500).json({ message: err.message });
  }
};

// Confirm ride
module.exports.confirmRide = async (req, res) => {
  console.log(" confirmRide called with body:", req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(" Validation error:", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const ride = await rideService.confirmRide({
      rideId,
      captain: req.captain
    });

    console.log("Ride confirmed:", ride);

    const rideWithUser = await rideModel.findById(ride._id).populate('user');
    if (!rideWithUser.user) {
      console.log(" User not found for ride");
      return res.status(404).json({ message: "User not found" });
    }

    const rideData = {
      ...rideWithUser.toObject(),
      user: {
        _id: rideWithUser.user._id,
        fullname: `${rideWithUser.user.fullname.firstname} ${rideWithUser.user.fullname.lastname || ''}`,
        email: rideWithUser.user.email,
        socketId: rideWithUser.user.socketId
      }
    };

    console.log(" Emitting ride-confirmed to user:", rideData.user._id);
    sendMessageToSocketId(rideData.user.socketId, "ride-confirmed", rideData);

    res.status(200).json(rideData);
  } catch (err) {
    console.error("confirmRide error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Start ride
module.exports.startRide = async (req, res) => {
  console.log(" startRide called with query:", req.query);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(" Validation error:", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId, otp } = req.query;

  try {
    const ride = await rideService.startRide({
      rideId,
      otp,
      captain: req.captain
    });

    console.log(" Ride started:", ride);

    const rideWithUser = await rideModel.findById(ride._id).populate('user');
    if (!rideWithUser.user) {
      console.log("User not found for ride");
      return res.status(404).json({ message: "User not found" });
    }

    const rideData = {
      ...rideWithUser.toObject(),
      user: {
        _id: rideWithUser.user._id,
        fullname: `${rideWithUser.user.fullname.firstname} ${rideWithUser.user.fullname.lastname || ''}`,
        email: rideWithUser.user.email,
        socketId: rideWithUser.user.socketId
      }
    };

    console.log("Emitting ride-started to user:", rideData.user._id);
    sendMessageToSocketId(rideData.user.socketId, "ride-started", rideData);

    res.status(200).json(rideData);
  } catch (err) {
    console.error("startRide error:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

// End ride
module.exports.endRide = async (req, res) => {
  console.log("endRide called with body:", req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const ride = await rideService.endRide({
      rideId,
      captain: req.captain
    });

    const rideWithUser = await rideModel.findById(ride._id).populate('user');
    if (rideWithUser?.user?.socketId) {
      console.log("Emitting ride-ended to user:", rideWithUser.user._id);
      sendMessageToSocketId(rideWithUser.user.socketId, "ride-ended", rideWithUser);
    }

    return res.status(200).json(ride);
  } catch (err) {
    console.error("endRide error:", err.message);
    return res.status(500).json({ message: err.message });
  }
};

// Get ride
module.exports.getRide = async (req, res) => {
  console.log("getRide called with id:", req.params.id);

  try {
    const ride = await rideService.getRide(req.params.id);
    res.status(200).json(ride);
  } catch (err) {
    console.error(" getRide error:", err.message);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
