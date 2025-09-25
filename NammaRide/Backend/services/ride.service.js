const rideModel = require('../models/ride.model');
const mapService = require('./maps.service');
const crypto = require('crypto');
const { sendMessageToSocketId } = require('../socket');
const captainModel = require('../models/captain.model');

// OTP generator
function generateOtp(num) {
  return crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
}

// Fare calculation
module.exports.getFare = async (pickup, destination) => {
  if (!pickup || !destination) throw new Error('pickup and destination are required');

  const distanceTime = await mapService.getDistanceTime(pickup, destination);

  const parseValue = (d) => parseFloat(d.replace(/[^\d.]/g, ''));
  const distanceKm = parseValue(distanceTime.distance);
  const durationMin = parseValue(distanceTime.duration);

  const baseFare = { auto: 18, car: 35, motorcycle: 12 };
  const perKmRate = { auto: 10, car: 15, motorcycle: 8 };
  const perMinuteRate = { auto: 2, car: 3, motorcycle: 1.5 };

  return {
    auto: Math.round(baseFare.auto + distanceKm * perKmRate.auto + durationMin * perMinuteRate.auto),
    car: Math.round(baseFare.car + distanceKm * perKmRate.car + durationMin * perMinuteRate.car),
    motorcycle: Math.round(baseFare.motorcycle + distanceKm * perKmRate.motorcycle + durationMin * perMinuteRate.motorcycle),
  };
};

// Create ride
module.exports.createRide = async ({ user, pickup, destination, vehicleType }) => {
  if (!user || !pickup || !destination || !vehicleType)
    throw new Error('All fields are required');

  if (!['auto', 'car', 'motorcycle'].includes(vehicleType))
    throw new Error('Invalid vehicle type');

 const distanceTime = await mapService.getDistanceTime(pickup, destination);
const fare = await module.exports.getFare(pickup, destination);

const ride = await rideModel.create({
  user,
  pickup,
  destination,
  otp: generateOtp(4),
  fare: Number(fare[vehicleType]),
  distance: parseFloat(distanceTime.distance.replace(/[^\d.]/g,'')), // save distance
  status: 'pending',
});
  return ride;
};

// Confirm ride
module.exports.confirmRide = async ({ rideId, captain }) => {
  if (!rideId) throw new Error('Ride id is required');

  const ride = await rideModel.findOneAndUpdate(
    { _id: rideId },
    { status: 'accepted', captain: captain._id, rideAcceptedAt: new Date() },
    { new: true }
  )
    .populate('user', 'fullname email socketId')
    .populate('captain', 'fullname vehicle socketId')
    .select('+otp');

  if (!ride) throw new Error('Ride not found');

  // ✅ Notify the passenger that their ride was accepted
  if (ride.user?.socketId) {
    sendMessageToSocketId(ride.user.socketId, 'ride-accepted', ride);
  }

  // ✅ (Optional) Notify the captain too (confirmation success)
  if (ride.captain?.socketId) {
    sendMessageToSocketId(ride.captain.socketId, 'ride-confirmed', ride);
  }

  return ride;
};

// Start ride
module.exports.startRide = async ({ rideId, otp, captain }) => {
  if (!rideId || !otp) throw new Error('Ride id and otp are required');

  const ride = await rideModel.findById(rideId)
    .populate('user')
    .populate('captain')
    .select('+otp');

  if (!ride) throw new Error('Ride not found');
  if (ride.status !== 'accepted') throw new Error('Ride not accepted');
  if (ride.otp !== otp) throw new Error('Invalid OTP');

  const updatedRide = await rideModel.findByIdAndUpdate(
    rideId,
    { status: 'ongoing', rideStartedAt: new Date() },
    { new: true }
  )
    .populate('user', 'fullname email socketId')
    .populate('captain', 'fullname vehicle socketId');

  sendMessageToSocketId(updatedRide.user.socketId, 'ride-started', updatedRide);

  return updatedRide;
};

// End ride
module.exports.endRide = async ({ rideId, captain }) => {
  if (!rideId) throw new Error('rideId is required');

  const ride = await rideModel.findOneAndUpdate(
    { _id: rideId, captain: captain._id },
    { status: 'completed', rideEndedAt: new Date() },
    { new: true }
  ).populate('user', 'fullname email socketId');

  if (!ride) throw new Error('Ride not found');

  await captainModel.findByIdAndUpdate(captain._id, {
    $inc: {
      completedRides: 1,
      totalEarnings: ride.fare || 0,
      totalHours:
        ride.rideStartedAt && ride.rideEndedAt
          ? (ride.rideEndedAt - ride.rideStartedAt) / 3600000 
          : 0,
      totalKm: ride.distance || 0,
    },
  });

  if (ride.user?.socketId) {
    sendMessageToSocketId(ride.user.socketId, 'ride-ended', ride);
  }

  return ride;
};

// Get ride details
module.exports.getRide = async (rideId) => {
  if (!rideId) throw new Error('rideId is required');

  const ride = await rideModel.findById(rideId)
    .populate('user', 'fullname email socketId')
    .populate('captain', 'fullname vehicle socketId')
    .select('+otp');

  if (!ride) throw new Error('Ride not found');

  return ride;
};
