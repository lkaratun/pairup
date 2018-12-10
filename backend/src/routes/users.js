const express = require('express');
const User = require('../models/User');
const Attendee = require('../models/EventAttendee');

const router = express.Router();

router.get('/', (req, res) => {
  const user = new User({id: req.user.id});
  user.read()
  .then(() => {res.json(user.data);})
  .catch(err => {res.status(err.statusCode || 400).json({message: err.message});});
});

router.delete('/', (req, res) => {
    req.user.delete()
    .then(() => {res.status(204).json();})
    .catch(err => {res.status(err.statusCode || 400).json({message: err.message});});
});

router.put('/', (req, res) => {
  req.user.data = req.body;
  req.user.update()
  .then(() => {res.json();})
  .catch(err => {res.status(err.statusCode || 400).json({message: err.message}); });
});

router.get('/events', (req, res) => {
  const attendee = new Attendee({userid: req.user[req.user.pk]});
  attendee.getAllEvents()
  .then(data => {res.json({events: data});})
  .catch(err => {res.status(err.statusCode || 400).json({message: err.message}); });
});

router.get('/:id/events', (req, res) => {
  const attendee = new Attendee({userid: req.params.id});
  attendee.getAllEvents()
  .then(data => {res.json({events: data});})
  .catch(err => {res.status(err.statusCode || 400).json({message: err.message});});
});

module.exports = router;