const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  date: Date,
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
