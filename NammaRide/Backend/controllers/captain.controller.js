const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('../models/blacklistToken.model');
const rideModel = require('../models/ride.model');
const rideService = require('../services/ride.service');

module.exports.registerCaptain = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { fullname, email, password, vehicle } = req.body;

  const existingCaptain = await captainModel.findOne({ email });
  if (existingCaptain) return res.status(400).json({ message: 'Captain already exists' });

  const hashedPassword = await captainModel.hashPassword(password);

  const captain = await captainService.createCaptain({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashedPassword,
    color: vehicle.color,
    plate: vehicle.plate,
    capacity: vehicle.capacity,
    vehicleType: vehicle.vehicleType
  });

  const token = captain.generateAuthToken();
  res.status(201).json({ token, captain });
};

module.exports.loginCaptain = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  const captain = await captainModel.findOne({ email }).select('+password');
  if (!captain) return res.status(401).json({ message: 'Invalid email or password' });

  const isMatch = await captain.comparePassword(password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

  const token = captain.generateAuthToken();
  res.cookie('token', token, { httpOnly: true });
  res.status(200).json({ token, captain });
};

module.exports.getCaptainProfile = async (req, res) => {
  try {
    const captainId = req.captain._id;

    // Fetch all completed rides for this captain
    const rides = await rideModel.find({ captain: captainId, status: 'completed' });

    // Total earnings
    const totalEarnings = rides.reduce((sum, ride) => sum + ride.fare, 0);

    // Total trips
    const totalTrips = rides.length;

    // Total kilometers
    const totalKm = rides.reduce((sum, ride) => sum + (ride.distance || 0), 0);

    // Hours Online (optional: can calculate real online hours or keep dummy)
    const totalHoursOnline = rides.reduce((sum, ride) => {
      if (ride.rideStartedAt && ride.rideEndedAt) {
        return sum + (ride.rideEndedAt - ride.rideStartedAt) / 3600000; // ms → hours
      }
      return sum;
    }, 0);

    res.status(200).json({
      captain: req.captain,
      stats: {
        totalEarnings: totalEarnings.toFixed(2),
        totalTrips,
        totalKm: totalKm.toFixed(2),
        totalHoursOnline: totalHoursOnline.toFixed(2)
      }
    });
  } catch (err) {
    console.error("getCaptainProfile error:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};





module.exports.logoutCaptain = async (req, res) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (token) await blacklistTokenModel.create({ token });
  res.clearCookie('token');
  res.status(200).json({ message: 'Logout successfully' });
};

