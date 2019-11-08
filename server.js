'use strict';

// Define the requirements of the server
// 1. Express on top of Node
// 2. dotenv to specify port (consume .env files)
// 3. COrS to prevent (Cross-Origin Scripting)
// 4. superagent to help with promises.
// 5. postgres for node for the database client object

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());



//Define Port to be listened to
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.error(err));





//Define Functional Routes
//Requests to /location are handled with the handleLocation function.
app.get('/location', getLocation);

//Requests to /weather are handled with the handleWeather function.
app.get('/weather', getWeather);


//Requests to root are handled with the landingPage function.
app.get('/', landingPage);


// Helper Functions
function landingPage(request, response) {
  response.status(200).send('Welcome to my back-end.');
}

Location.prototype.save = function(){
  const SQL = `INSERT INTO locations(search_query, formatted_query, latitude, longitude) VALUES('$1', '$2', $3, $4) RETURNING *`;
  
}

Location.fetchLocation = function(){
  //fetch API
}

function getLocation(request, response){

  const locationHandler = {
    query: request.query.data,

    cacheHit: results => response.send(results.rows[0]),

    cacheMiss: () => {
      Location.fetchLocation(request.query.data)
        .then( data=> response.send(data));
    }
  };
  Location.lookup(locationHandler);
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

// TODO: Define prototype for Location Constructor that saves data
Location.prototype.save = function(){
  const SQL = `INSERT INTO locations(search_query, formatted_query, latitude, longitude) VALUES ($1,$2,$3,$4) RETURNING *`;

  let values = Object.values(this);
  return client.query(SQL, values);
};

Location.fetchLocation = function (query){
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.GEOCODE_API_KEY}`;

  return superagent.get(url)
    .then( result => {
      if (result.body.results.length) {throw 'No data';}
      let location = new Location(query, result.body.results[0]);
      return location.save()
      .then( result => {
        location.id = result.rows[0].id;
        return location;
      });
    });
};

Location.lookup = (handler) => {
  const SQL = `SELECT * FROM locations WHERE search_query=$1`;
  const values = [handler.query];

  return client.query(SQL, values)
    .then( results => {
      if (results.rowCount > 0){
        handler.cacheHit(results);
      } else {
        handler.cacheMiss();
      }
    })
    .catch(console.error);
};


function Forecast (day){
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toDateString();
}

function checkDB (input, request, response){
  const SQL = `SELECT * FROM locations WHERE city_name LIKE ('${input}')`;
  client.query(SQL, (error, resolve) => {
    error ? console.error(error) : 
    resolve.rowCount === 0 ? handleLocation(request, response):
    resolve.rows[0].
    //TODO: Take the thing out of database, format, return;
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
