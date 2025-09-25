const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const captainSchema = new mongoose.Schema({
  fullname: {
    firstname: { type: String, required: true, minlength: 3 },
    lastname: { type: String, minlength: 1 }
  },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  socketId: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },

  vehicle: {
    color: { type: String, required: true, minlength: 3 },
    plate: { type: String, required: true, minlength: 3 },
    capacity: { type: String, required: true, minlength: 1 },
    vehicleType: { type: String, required: true, enum: ['car', 'motorcycle', 'auto'] }
  },

  // Proper geospatial location
  location: {
    type: {
      type: String,
      enum: ['Point'], 
      default: 'Point'
    },
    coordinates: {
      type: [Number], 
      default: [0, 0]
    }
  },

  // ✅ Captain stats
  completedRides: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  totalHours: { type: Number, default: 0 }, // in hours
  totalKm: { type: Number, default: 0 }, // in km

  

});

// Create 2dsphere index
captainSchema.index({ location: '2dsphere' });

// Auth methods
captainSchema.methods.generateAuthToken = function() {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

captainSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

captainSchema.statics.hashPassword = async function(password) {
  return bcrypt.hash(password, 10);
};

const captainModel = mongoose.model('captain', captainSchema);
module.exports = captainModel;
