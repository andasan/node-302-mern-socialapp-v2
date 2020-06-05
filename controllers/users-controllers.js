const {v4: uuidv4 } = require('uuid');
const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');

let USERS = require('../data').DUMMY_USERS;

exports.getUser = (req,res,next) => {
    res.json({users: USERS});
}

exports.signup = (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        throw new HttpError(errors.array()[0].msg, 422);
    }
    const { username, email, password } = req.body;

    const hasUser = USERS.find(u => u.email === email);
    if(hasUser){
        throw new HttpError('This email already exists!',422);
    }

    const createdUser = {
        id: uuidv4(),
        username,
        email,
        password
    };

    USERS.push(createdUser);
    res.status(201).json({user: createdUser, message: 'New User Created'});
}

exports.login = (req,res,next) => {
    const { email, password } = req.body;
    const identifiedUser = USERS.find(u => u.email === email);
    if(!identifiedUser || identifiedUser.password !== password){
        throw new HttpError('Could not identify use. Incorrect credentials', 401);
    }
    res.status(200).json({message: 'Logged in!'});
}