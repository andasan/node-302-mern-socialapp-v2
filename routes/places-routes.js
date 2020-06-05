const express = require('express');
const { check } = require('express-validator');

const placesControllers = require('../controllers/places-controllers');
const router = express.Router();

router.get('/user/:uid', placesControllers.getPlacesByUserId );

router.get('/:pid', placesControllers.getPlaceById );

router.post('/', [
    check('title').not().isEmpty(),
    check('description').isLength({min:5}),
    check('address').not().isEmpty()
], placesControllers.postPlace );

router.patch('/:pid', [
    check('title').not().isEmpty(),
    check('description').isLength({min:5})
], placesControllers.patchPlace);

router.delete('/:pid', placesControllers.deletePlace)

module.exports = router;