const { ResultWithContextImpl } = require('express-validator/lib/chain');
const { validate } = require('../models/user.model');
const mapService = require('../services/maps.service');
const { validationResult} = require('express-validator');


module.exports.getCoordinates = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {address} = req.query;
    try {
        const coordinates = await mapService.getAddressCoordinate(address);
        res.status(200).json(coordinates);
    } catch (error) {
        res.status(400).json({ message: 'coordinate not found'});
    }
};

module.exports.getDistanceTime = async (req, res, next) => {
 try{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const {origin, destination } = req.query;
    const DistanceTime = await mapService.getDistanceTime(origin, destination);
    res.status(200).json(DistanceTime);
 }catch (err) {
    console.error(err);
    res.status(500).json({message:'internal server error'});
 }
};


module.exports.getAutoCompleteSuggestions = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { input } = req.query;
    const suggestions = await mapService.getAutoCompleteSuggestions(input);
    res.status(200).json(suggestions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
