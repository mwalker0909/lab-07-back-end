'use strict';

// Define the requirements of the server
// 1. Express on top of Node
// 2. dotenv to specify port (consume .env files)
// 3. COrS to prevent (Cross-Origin Scripting)
// 4. superagent to help with promises.

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.error(err));




//Define Functional Routes

//Requests to /location are handled with the handleLocation function.
app.get('/location', handleLocation);

//Requests to /weather are handled with the handleWeather function.
app.get('/weather', handleWeather);

//Requests to root are handled with the landingPage function.
app.get('/', landingPage);


// Helper Functions
function landingPage(request, response) {
  response.status(200).send('Welcome to my back-end.');
}

function handleLocation(request, response) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${request.query.data}&key=${process.env.GEOCODE_API_KEY}`;
  superagent.get(url)
    .then( data => {
      const geoData = data.body;
      const city = request.query.data;
      checkDB(city);
      const location = new Location(city, geoData);
      response.status(200).send(location);
    })
    .catch( error => {
      console.error(error);
      response.status(500).send('Status: 500. Sorry, there is something not quite right');
    })
}

function handleWeather(request, response){
  const url = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${request.query.data.latitude},${request.query.data.longitude}`;
  superagent.get(url)
    .then( data => {
      const weatherData = data.body;
      const dailyWeather = weatherData.daily.data;
      let newdailyWeather = dailyWeather.map(day => new Forecast(day));
      response.status(200).send(newdailyWeather);
    })
    .catch( error => {
      console.error(error);
      response.status(500).send('Status: 500. Sorry, there is something not quite right');
    })
}

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

function checkDB (input){
  const SQL = ` locations(city_name) VALUES('${input}')`;
  client.query(SQL, (err, res) => {
    err ? console.error(err) : console.log(res.rows);
  });
}

//Non-valid page response
app.use('*', (request, response) => response.status(404).send('Sorry, that route does not exist.'));

//Begin listening to port
client.connect()
  .then( () => {
    app.listen(PORT,() => {
      console.log(`Listening on port ${PORT}`);
    });
  })
  .catch( error => {
    console.error(error)
  });
