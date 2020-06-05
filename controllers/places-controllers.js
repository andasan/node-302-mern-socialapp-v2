const {v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordsFromAddress = require('../util/location');

const Place = require('../models/place');

let PLACES = require('../data').DUMMY_PLACES;

exports.getPlacesByUserId = async (req,res,next) => {
    const userId = req.params.uid;
    // const places = PLACES.filter(place => place.creator === userId);
    
    let places;
    try{
        places = await Place.find({ creator: userId });
    }catch(err){
        return next( new HttpError('Something went wrong, could not find a place' ,500) );
    }

    if(places.length === 0){
        throw new HttpError('Could not find places for the provided user id', 404);
    }
    res.json({message: 'Your places', places: places});
};

exports.getPlaceById = async (req,res,next)=> {
    const placeId = req.params.pid;
    // const place = PLACES.find(p => p.id === placeId);

    let place;
    try{
        place = await Place.findById(placeId);
    }catch(err){
        return next( new HttpError('Something went wrong, could not find a place' ,500) );
    }

    if(!place){
        return next( new HttpError('Could not find a place for the provided id' ,404) );
    }
    res.json({place});
};

exports.postPlace = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        // throw new HttpError('Invalid inputs, please check your data.', 422);
        return next(new HttpError('Invalid inputs, please check your data.', 422));
    }
    const { title, description, address, creator } = req.body;

    let coordinates;
    //handle error in async/await
    try{
        coordinates = await getCoordsFromAddress(address);
    }catch(err){
        return next(err);
    }

    // const createdPlace = {
    //     id: uuidv4(),
    //     title,
    //     description,
    //     location: coordinates,
    //     address,
    //     creator
    // };
    // PLACES.push(createdPlace);

    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        imageUrl: 'https://images.unsplash.com/photo-1459983001447-eea6d4fbfbb1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1352&q=80',
        creator
    });

    try{
        await createdPlace.save();
    }catch(err){
        return next(new HttpError('Creating place failed, please try again.', 500));
    }

    res.status(201).json({place: createdPlace, message: 'A new place has been created.'});
}
////  mongodb+srv://<username>:<password>@francois-db-c0gfm.mongodb.net/<DBNAME>?retryWrites=true&w=majority

exports.patchPlace = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next( new HttpError('Invalid inputs, please check your data.', 422) );
    }
    const { title, description } = req.body;
    const placeId = req.params.pid;

    // const updatedPlace = PLACES.find(p => p.id === placeId);
    // const placeIndex = PLACES.findIndex(p => p.id === placeId);

    let updatedPlace
    try{
        updatedPlace = await Place.findById(placeId);
    }catch(err){
        return next( new HttpError('Something went wrong, could not find a place' ,500) );
    }

    updatedPlace.title = title;
    updatedPlace.description = description;

    // PLACES[placeIndex] = updatedPlace;

    try{
        await updatedPlace.save();
    }catch(err){
        return next( new HttpError('Something went wrong, could not find a place' ,500) );
    }

    res.status(200).json({place: updatedPlace, message: 'Update place'});
};

exports.deletePlace = async (req,res,next) => {
    const placeId = req.params.pid;
    // PLACES = PLACES.filter(p => p.id !== placeId);

    let place;
    try{
        place = await Place.findById(placeId);
    }catch(err){
        return next( new HttpError('Something went wrong, could not delete this place', 500) );
    }

    try{
        await place.remove();
    }catch(err){
        return next( new HttpError('Something went wrong, could not delete place', 500) )
    }

    res.status(200).json({message: 'Delete place'});
}