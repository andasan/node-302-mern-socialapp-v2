// const {v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const getCoordsFromAddress = require('../util/location');

const Place = require('../models/place');
const User = require('../models/user');

// let PLACES = require('../data').DUMMY_PLACES;

exports.getPlacesByUserId = async (req,res,next) => {
    const userId = req.params.uid;
    // const places = PLACES.filter(place => place.creator === userId);
    
    let userWithPlaces;
    try{
        // userWithPlaces = await Place.find({ creator: userId });
        userWithPlaces = await User.findById(userId).populate('places');
    }catch(err){
        return next( new HttpError('Something went wrong, could not find a place' ,500) );
    }

    if(!userWithPlaces || userWithPlaces.length === 0){
        return next( new HttpError('Could not find places for the provided user id', 404));
    }

    res.json({message: 'Your places', userWithPlaces});
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
        image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1362&q=80',
        creator
    });

    let user;
    try{
        user = await User.findById(creator);
    }catch(err){
        return next(new HttpError('Creating place failed, please try again', 500))
    }

    if(!user){
        return next(new HttpError('Could not find user for provided id', 404));
    }

    try{
        // await createdPlace.save();
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({session:sess}); //created the unique place id
        user.places.push(createdPlace); // push: establishing connection between 2 models + add to array
        await user.save({session:sess});
        await sess.commitTransaction();

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
        // place = await Place.findById(placeId);
        place = await Place.findById(placeId).populate('creator');
    }catch(err){
        return next( new HttpError('Something went wrong, could not delete this place', 500) );
    }

    try{
        // await place.remove();
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.remove({session: sess});
        place.creator.places.pull(place); //access the place stored in the user and pull it
        await place.creator.save({session:sess});
        await sess.commitTransaction();
    }catch(err){
        return next( new HttpError('Something went wrong, could not delete place', 500) )
    }

    res.status(200).json({message: 'Delete place'});
}