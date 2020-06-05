const axios = require('axios');
const HttpError = require('../models/http-error');

// async function getCoordsFromAddress(address){  
// }

const getCoordsFromAddress = async (address) => {
    const response = await axios
    .get(`https://maps.googleapis.com/maps/api/geocode/json?address=
        ${encodeURIComponent(address)}
        &key=YOUR_API_KEY`);
}

module.exports = getCoordsFromAddress;