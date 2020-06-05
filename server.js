require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const HttpError = require('./models/http-error');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json({extended: false}));

app.use('/api/places', placesRoutes) //route for places
app.use('/api/users', usersRoutes) //route for users

app.use((req,res,next) => {
    throw new HttpError('Could not find this route', 404,);
});

app.use((error,req,res,next) => {
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 500).json({message: error.message || 'An unknown error occurred'})
});

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>{
        console.log('Connected to Database');
        app.listen(PORT);
    })
    .catch(err => {
        console.log(err);
    });