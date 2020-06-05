const express = require('express');
const { check } = require('express-validator');

const usersControllers = require('../controllers/users-controllers');

const router = express.Router();

router.get('/', usersControllers.getUser);

router.post('/signup', [
    check('username').not().isEmpty().withMessage('Username is empty'),
    check('email').normalizeEmail().isEmail().withMessage('Please enter a valid email'),
    check('password').isLength({min:6})
], usersControllers.signup);

router.post('/login', usersControllers.login);

module.exports = router;