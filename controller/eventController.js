const Event = require('../model/eventModel');
const path = require('path');

exports.addEvent = async (req, res) => {
  // Log information about the incoming request
  console.log('POST request received to add an event');

  // Log the request body (eventData)
  console.log('Request body (eventData):', req.body);

  const eventData = req.body;

  // Create a new event using the Event model
  const newEvent = new Event({
    title: eventData.title,
    description: eventData.description,
    category: eventData.category,
    date: eventData.date,
  });

  try {
    // Save the new event to the database using await
    await newEvent.save();
    // Log information about the successfully added event
    console.log('Event added successfully:', newEvent);

    // Redirect to event.html with the added event's ID
    res.redirect(`/events.html?eventId=${newEvent._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving event to the database');
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    console.log('Server response:', events);
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller function to get an event by ID
exports.getEventById = async (req, res) => {
  console.log('===============')
  const { eventId } = req.params

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller function to render the edit event page
// exports.renderEditEventPage = async (req, res) => {
//   try {
//     // Fetch the event by ID
//     const event = await Event.findById(req.params.eventId);

//     if (!event) {
//       // Event not found
//       res.status(404).send('Event not found');
//       return;
//     }

//     // Render the edit event page and pass the event data
//     res.render('editEvent', { event });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// };

// Controller function to handle the update of the event

exports.updateEvent = async (req, res) => {
  const eventId = req.params.eventId;
  const {title, description, category, date}  = req.body

  try {
    // Find the event by ID
    const event = await Event.findById(eventId);

    if (!event) {
      // Event not found
      return res.status(404).json({ error: 'Event not found' });
    }

    // Update event properties
    event.title = title;
    event.description = description;
    event.category = category;
    event.date = date;

    // Save the updated event to the database
    await event.save();

    // Send a success response
    res.status(200).json({ message: 'Event updated successfully', event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller function to delete an event by ID
exports.deleteEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    // Find the event by ID and delete it
    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      // Event not found
      return res.status(404).json({ error: 'Event not found' });
    }

    // Send a success response
    res.status(200).json({ message: 'Event deleted successfully', deletedEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
