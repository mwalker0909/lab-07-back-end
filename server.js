'use strict';

// Define the requirements of the server
// 1. Express on top of Node
// 2. dotenv to specify port (consume .env files)
// 3. COrS (Cross-Origin Scripting)

require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

//Define Port to be listened to
const PORT = process.env.PORT || 3000;

//Define Functional Routes
app.get('/location', (request, response) => {
  const city = request.query.data;
  const geoData = require('./data/geo.json');
  const locationData = new Location (city, geoData);
  response.send(locationData);
  console.log(locationData);
});

app.get('/weather', (request, response) => {
  const weatherData = require('./data/darksky.json');
  const dailyWeather = weatherData.daily.data;
  let newdailyWeather = dailyWeather.map(day => new Forecast(day));
  response.send(newdailyWeather);
});

// Helper Functions
function Location(city, geoData){
  this.search_query = city;
  this.formatted_query = geoData.results[0].formatted_address;
  this.latitude = geoData.results[0].geometry.location.lat;
  this.longitude = geoData.results[0].geometry.location.lng;
}

function Forecast (day){
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toDateString();
}

//Non-valid page response
app.use('*', (request, response) => response.status(404).send('Sorry, that route does not exist.'));

//Begin listening to port
app.listen(PORT,() => console.log(`Listening on port ${PORT}`));