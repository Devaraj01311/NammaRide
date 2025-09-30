const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('../models/blacklistToken.model');
const rideModel = require('../models/ride.model');
const rideService = require('../services/ride.service');
const { generateResetToken } = require('../utils/passwordUtils');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

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
        totalEarnings: parseFloat(totalEarnings.toFixed(2)),
        totalTrips,
        totalKm: parseFloat(totalKm.toFixed(2)),
        totalHoursOnline: parseFloat(totalHoursOnline.toFixed(2))
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

module.exports.forgotPassword = async function (req, res, next) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });

    // ✅ FIX: use userModel instead of User
    const user = await captainModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      // For security, respond with 200 even if user not found (prevent enumeration)
      return res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
    }

    // generate token
    const { token, hashed } = generateResetToken();
    const expires = Date.now() + 1000 * 60 * 60; // 1 hour

    user.resetPasswordToken = hashed;
    user.resetPasswordExpires = new Date(expires);
    await user.save();

    // Build reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`;

 const html = `
  <p>You requested a password reset. Click the button below to reset your password (expires in 1 hour):</p>
  <p style="text-align:center;">
    <a href="${resetUrl}" style="
        display:inline-block;
        padding:10px 20px;
        font-size:16px;
        color:#ffffff;
        background-color:#4f46e5;
        text-decoration:none;
        border-radius:5px;
      ">
      Reset Password
    </a>
  </p>
  <p>If you didn't request this, ignore this email.</p>
`;


    console.log("📧 Sending reset link to:", user.email);

    await sendEmail({ to: user.email, subject: 'Reset your password', html });

    return res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (err) {
    console.error('forgotPassword error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


// POST /auth/reset-password
module.exports.resetPassword = async (req, res, next) => {
  try {
    const { token, email, newPassword } = req.body;
    if (!token || !email || !newPassword)
      return res.status(400).json({ message: 'Missing required fields' });

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await captainModel.findOne({
      email: email.toLowerCase(),
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() }
    }).select('+password');

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash new password and save
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const html = `<p>Your password was successfully updated. If you did not perform this action, contact support immediately.</p>`;
    await sendEmail({ to: user.email, subject: 'Password changed successfully', html });

    return res.status(200).json({ message: 'Password successfully reset' });
  } catch (err) {
    console.error('resetPassword error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
