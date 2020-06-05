const {v4: uuidv4 } = require('uuid');
const HttpError = require('../models/http-error');

let USERS = require('../data').DUMMY_USERS;

exports.getUser = (req,res,next) => {
    res.json({users: USERS});
}

exports.signup = (req,res,next) => {
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
    // res.json({users: USERS});
}