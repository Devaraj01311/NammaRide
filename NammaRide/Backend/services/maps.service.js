const axios = require('axios');
const captainModel = require('../models/captain.model');

module.exports.getAddressCoordinate = async (address) => {
    const apiKey = process.env.GOOGLE_MAPS_API;

    if (!apiKey) {
        throw new Error('Google Maps API key not set in environment variables.');
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const results = response.data.results;

        if (results && results.length > 0) {
            const location = results[0].geometry.location;
            return { lat: location.lat, lng: location.lng };
        } else {
            throw new Error('No results found for the given address.');
        }
    } catch (error) {
        throw new Error(`Failed to fetch coordinates: ${error.message}`);
    }
};

module.exports.getDistanceTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error('Origin and destination are required');
  }

  const apiKey = process.env.GOOGLE_MAPS_API;

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.status !== 'OK') {
      throw new Error('Failed to get distance and duration');
    }

    const element = data.rows[0]?.elements[0];

    if (!element || element.status !== 'OK') {
      throw new Error('No route found between origin and destination');
    }

    return {
      origin: data.origin_addresses[0],
      destination: data.destination_addresses[0],
      distance: element.distance.text,
      duration: element.duration.text,
    };
  } catch (error) {
    console.error('Error fetching distance/time:', error.message);
    throw new Error(`Distance Matrix API failed: ${error.message}`);
  }
};

module.exports.getAutoCompleteSuggestions = async (input) => {
  if (!input) {
    throw new Error("query is required");
  }

  const apiKey = process.env.GOOGLE_MAPS_API;
  if (!apiKey) {
    throw new Error("Google Maps API key not set");
  }

  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      return response.data.predictions;
    } else {
      throw new Error(`Unable to fetch suggestions: ${response.data.status}`);
    }
  } catch (err) {
    console.error("Autocomplete API error:", err.message);
    throw err;
  }
};

module.exports.getCaptainInTheRadius = async (lat, lng, radius) => {
  const captains = await captainModel.find({
    location: {
      $geoWithin: {
        $centerSphere: [ [lng, lat], radius / 6371 ]  
      }
    }
  });
  return captains;
};
