const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const BlacklistTokenModel = require('../models/blacklistToken.model');
const { generateResetToken } = require('../utils/passwordUtils');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const {hashPassword} = require('../models/user.model');

module.exports.registerUser = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    console.log(req.body);

    const { fullname, email, password } = req.body;

    const hashPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashPassword
    });

    const token = user.generateAuthToken();

    res.status(201).json({ token, user });


}

module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors. isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email}).select('+password');
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" }); 
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = user.generateAuthToken();

    res.cookie('token', token);
    
    res.status(200).json({ token, user });
}

module.exports.getUserProfile = async (req, res, next) => {
    
    res.status(200).json(req.user);
    
}

module.exports.logoutUser = async (req, res, next) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    await BlacklistTokenModel.create({ token });
    
    res.status(200).json({ message: 'Logged out successfully' });
}

// POST /users/forgot-password
module.exports.forgotPassword = async function (req, res, next) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });

    // ✅ FIX: use userModel instead of User
    const user = await userModel.findOne({ email: email.toLowerCase() });
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

    const user = await userModel.findOne({
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