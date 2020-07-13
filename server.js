'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { flights } = require('./test-data/flightSeating');

const PORT = process.env.PORT || 8000;

const handleFlights = (req, res) => {
  // get all flight numbers
  const allFlights = Object.keys(flights);
  //Send back an array of the flight numbers
  res.status(200).send(allFlights);
}

const handleFlight = (req, res) => {
  const { flightNumber } = req.params;
  // get all flight numbers
  const allFlights = Object.keys(flights);
  // is flightNumber in the array? Yes => send flight info. No => throw error
  if(allFlights.includes(flightNumber)) {
    res.status(200).send(flights[flightNumber]);
  } else {
    throw new Error('Problem in flightSeating.js');
  }
};

express()
  .use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  })
  .use(morgan('dev'))
  .use(express.static('public'))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))

  // endpoints
  .get('/flights/', handleFlights)
  .get('/flights/:flightNumber', handleFlight)
  .use((req, res) => res.send('Not Found'))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
