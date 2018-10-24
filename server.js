'use strict'

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

require('dotenv').config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());

app.get('/location', (request, response) => {
  getLocation(request.query.data)
    .then(locationData => response.send(locationData))
    .catch(error => handleError(error, response))
});

app.get('/weather', getWeather);

function handleError(err, res){
  console.error('ERR', err);
  if (res) res.status(500).send('Oh NOOO!!!!  we\'re so sorry');
}

function getLocation(query){
  const geoData = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.GOOGLE_MAPS_API}`;
  return superagent.get(geoData)
    .then(data => {
      if (! data.body.results.length){ throw 'NO DATA';}
      else{
        let location = new Location(data.body.results[0]);
        location.search_query = query;
        return location;
      }
    });
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

function getWeather(request, response){
  const URL = `https://api.darksky.net/forecast/${process.env.DARK_SKY_API}/${request.query.data.latitude},${request.query.data.longitude}`;
  return superagent.get(URL)
    .then(forecastResults =>{
      const forecast = [];
      forecastResults.body.daily.data.forEach(day =>{
        const dayResult = new DailyWeather(day);
        forecast.push(dayResult);
      })
      console.log(forecast);
      response.send(forecast);
    })
    .catch(error => handleError(error, response));
}

function DailyWeather(data){
  this.forecast = data.summary;
  this.time = new Date(data.time * 1000).toString().slice(0,15);
}

app.listen(PORT, () => console.log(`App is up on ${PORT}`) );
