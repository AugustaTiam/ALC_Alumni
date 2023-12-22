const express = require('express');
const router = express.Router();
const eventController = require('../controller/eventController');
const Event = require('../model/eventModel');

// Route to add a new event
router.post('/events', eventController.addEvent);

// Route to get all events
router.get('/events', eventController.getAllEvents);

// Route to get a single event by ID
router.get('/:eventId', eventController.getEventById);

// Route for updating an event
router.post('/:eventId/updateEvent', eventController.updateEvent);

// Route for deleting an event by ID
router.delete('/:eventId/deleteEvent', eventController.deleteEvent);

module.exports = router;