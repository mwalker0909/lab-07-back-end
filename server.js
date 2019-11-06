'use strict';

// Define the requirements of the server
// 1. Express on top of Node
// 2. dotenv to specify port (consume .env files)
// 3. COrS (Cross-Origin Scripting)

require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const errormessage = 'Lynnwood is the only city worth knowing.';

//Define Port to be listened to
const PORT = process.env.PORT;

//Default routes and error
app.use(express.static('./front-end'));

//Define Functional Routes
app.get('/location', (request, response) => {
  const city = request.query.data;
  if (city.toLowerCase() !== 'lynnwood'){
    throw errormessage;
  }
  try{
    const geoData = require('./data/geo.json');
    const locationData = new Location (city, geoData);
    response.send(locationData);
  }
  catch(error){
    response.status(500).send(error);
  }
});

app.get('/weather', (request, response) => {
  const weatherData = require('./data/darksky.json');
  const forecastDataArray = [];
  for(let i = 0; i < weatherData.daily.data.length; i++){
    let forecastData = new Forecast (i, weatherData);
    forecastDataArray.push(forecastData);
  }
  response.send(forecastDataArray);
});


// Helper Functions
function Location(city, geoData){
  this.search_query = city;
  this.formatted_query = geoData.results[0].formatted_address;
  this.latitude = geoData.results[0].geometry.location.lat;
  this.longitude = geoData.results[0].geometry.location.lng;
}

function Forecast (i, weatherData){
  this.forecast = weatherData.daily.data[i].summary;
  this.time = new Date(weatherData.daily.data[i].time * 1000).toDateString();
}

//Non-valid page response
app.use('*', (request, response) => response.status(404).send('Sorry, that route does not exist.'));

//Begin listening to port
app.listen(PORT,() => console.log(`Listening on port ${PORT}`));
