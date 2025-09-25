const { Server } = require("socket.io");
const mongoose = require("mongoose");
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Handle join/register event
    socket.on('join', async (data) => {
      const { userId, userType } = data;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.log(`Invalid userId: ${userId}`);
        return;
      }

      try {
        if (userType === 'user') {
          await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
          console.log(` User ${userId} registered with socket ${socket.id}`);
        } else if (userType === 'captain') {
          await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
          console.log(`Captain ${userId} registered with socket ${socket.id}`);
        }
      } catch (err) {
        console.error("Error updating socketId:", err.message);
      }
    });

    // Handle chat messages
    socket.on("chatMessage", (msg) => {
      console.log(`Message from ${socket.id}: ${msg}`);
      io.emit("chatMessage", msg); 
    });

  socket.on('update-location-captain', async (data) => {
  try {
    const { userId, userType, location } = data;

    if (!location || location.lat == null || location.lng == null) {
      return socket.emit('error', { message: 'Invalid location data' });
    }

    await captainModel.findByIdAndUpdate(userId, {
      location: {
        type: 'Point',
        coordinates: [location.lng, location.lat], // GeoJSON order: [lng, lat]
      },
    });

    console.log(`Updated location for captain ${userId}:`, location);
  } catch (err) {
    console.error('update-location-captain error:', err.message);
  }
});
    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(` Client disconnected: ${socket.id}`);
    });
  });
}

// Send message to specific socket
function sendMessageToSocketId(socketId, event, payload) {
  console.log(`Sending "${event}" to ${socketId}`, payload);

  if (io) {
    io.to(socketId).emit(event, payload); 
  } else {
    console.log("Socket.io not initialized.");
  }
}

module.exports = { initializeSocket, sendMessageToSocketId };
