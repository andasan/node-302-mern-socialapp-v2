const {v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordsFromAddress = require('../util/location');

let PLACES = require('../data').DUMMY_PLACES;

exports.getPlacesByUserId = (req,res,next) => {
    const userId = req.params.uid;
    const places = PLACES.filter(place => place.creator === userId);

    if(places.length === 0){
        throw new HttpError('Could not find places for the provided user id', 404);
    }
    res.json({message: 'Your places', places: places});
};

exports.getPlaceById = (req,res,next)=> {
    const placeId = req.params.pid;
    const place = PLACES.find(p => p.id === placeId);

    if(!place){
        return next( new HttpError('Could not find a place for the provided id' ,404) );
    }
    res.json({place});
};

exports.postPlace = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        throw new HttpError('Invalid inputs, please check your data.', 422);
    }
    const { title, description, address, creator } = req.body;

    let coordinates;
    //handle error in async/await
    try{
        coordinates = await getCoordsFromAddress(address);
    }catch(err){
        return next(err);
    }

    const createdPlace = {
        id: uuidv4(),
        title,
        description,
        location: coordinates,
        address,
        creator
    };
    PLACES.push(createdPlace);
    res.status(201).json({place: createdPlace, message: 'A new place has been created.'});
}

exports.patchPlace = (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        throw new HttpError('Invalid inputs, please check your data.', 422);
    }
    const { title, description } = req.body;
    const placeId = req.params.pid;

    const updatedPlace = PLACES.find(p => p.id === placeId);
    const placeIndex = PLACES.findIndex(p => p.id === placeId);
    updatedPlace.title = title;
    updatedPlace.description = description;

    PLACES[placeIndex] = updatedPlace;

    res.status(200).json({place: updatedPlace, message: 'Update place'});
};

exports.deletePlace = (req,res,next) => {
    const placeId = req.params.pid;
    PLACES = PLACES.filter(p => p.id !== placeId);
    // .remove()
    res.status(200).json({place: PLACES, message: 'Delete place'});
}