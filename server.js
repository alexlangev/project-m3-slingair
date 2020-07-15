'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { flights } = require('./test-data/flightSeating');
const  {reservations } = require('./test-data/reservations');

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

const handleUsers = (req, res) => {
  const data = req.body;
  const id = Math.random();
  //reservation id
  const reservation = {
    seat: data.seat,
    flight: data.flight,
    givenName: data.givenName,
    surname: data.surname,
    email: data.email,
    id: id
  }
  reservations.push(reservation);
  //create reservation info and push it
  res.status(200).send({status: 'success', id: reservation.id});
}

const handleReservationId = (req,res) => {
  const id = req.params.id.slice(1);
  console.log(id);
  const reservation = reservations.find(reservation => reservation.id == id);
  res.status(200).send(reservation);
}

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
  .get('/reservations/:id', handleReservationId)
  .post('/users', handleUsers)
  .use((req, res) => res.send('Not Found'))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
