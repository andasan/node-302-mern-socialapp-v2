// const {v4: uuidv4 } = require('uuid');
const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');

const User = require('../models/user');
// let USERS = require('../data').DUMMY_USERS;

exports.getUser = async (req,res,next) => {
    let users;
    try{
        users = await User.find({}, '-password');
    }catch(err){
        return next(new HttpError('Fetching users failed, please try again', 500));
    }
    res.json({users: users});
}

exports.signup = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next( new HttpError(errors.array()[0].msg, 422));
    }
    const { username, email, password } = req.body;

    // const hasUser = USERS.find(u => u.email === email);
    // if(hasUser){
    //     throw new HttpError('This email already exists!',422);
    // }

    let existingUser;
    try{
        existingUser = await User.findOne({email:email});
    }catch(err){
        return next(new HttpError('Sign up failed, please try again', 500));
    }

    if(existingUser){
        return next(new HttpError('Email already exists', 422))
    }

    const createdUser = new User({
        username,
        email,
        imageUrl: 'https://images.unsplash.com/photo-1520315342629-6ea920342047?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80',
        password,
        places: []
    });

    try{
        await createdUser.save();
    }catch(err){
        return next(new HttpError('Sign up failed, please try again', 500));
    }

    // USERS.push(createdUser);
    res.status(201).json({user: createdUser, message: 'New User Created'});
}

exports.login = async (req,res,next) => {
    const { email, password } = req.body;
    // const identifiedUser = USERS.find(u => u.email === email);

    let existingUser;
    try{
        existingUser = await User.findOne({email:email});
    }catch(err){
        return next(new HttpError('Logging in failed, please try again', 500));
    }

    if(!existingUser || existingUser.password !== password){
        return next( new HttpError('Invalid credentials', 401));
    }

    res.status(200).json({message: 'Logged in!'});
}