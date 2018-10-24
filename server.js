'use strict'

const express = require('express');
const cors = require('cors');

require('dotenv').config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());

app.get('/location', (request, response) => {
  const locationData = searchLatiLong(request.query.data);
  response.send(locationData);
});

function searchLatiLong(query){
  const geoData = require('./data/geo.json');
  const location = new Location(geoData.results[0]);
  location.search_query = query;
  return location;
}

function Location(data){
  this.formatted_query = data.formatted_address;
  this.latitude = data.geometry.location.lat;
  this.longitude = data.geometry.location.lng;
}
//ToDO:  create an object constructor for weahter app.
//something like function WEATHER(dataWeather){}
//something like app.get('/weather', (request, response) => {});
//got it.  ok GO!

app.listen(PORT, () => console.log(`App is up on ${PORT}`) );
