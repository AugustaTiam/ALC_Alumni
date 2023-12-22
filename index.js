const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
require('dotenv').config();

const eventController = require('./controller/eventController');
const userController = require('./controller/userController'); 
const userRoutes = require('./routes/userRoutes');
const eventRouter = require('./routes/eventRoutes');
const formSubmissionRoutes = require('./routes/formSubmissionRoutes');

const app = express();
const port = 4000;

// Use express-session middleware
app.use(
  session({
    secret: 'ALC_Connect1', 
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware to parse JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mongo DB Codes........................................
// Connect to MongoDB using environment variable
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('Error connecting to MongoDB:', error.message);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Set up public and static files
app.set('public', path.join(__dirname, 'public'));
app.set('public engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all route for all the pages........................................
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/index*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/signup*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});
app.get('/login*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.get('/adminDashboard*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'adminDashboard.html'));
});
app.get('/resources*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'resources.html'));
});
app.get('/contact*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});
app.get('/guest*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'guest.html'));
});

app.get('/events*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'events.html'));
});


// Use the event router
app.use('/api/event', eventRouter);

// Use the user routes
app.use('/api/user', userRoutes);

// Route for adding an event
app.post('/addEvent', eventController.addEvent);

// Route for getting all events
app.get('/allEvents', eventController.getAllEvents);

// Route for updating an event
app.post('/:eventId/updateEvent', eventController.updateEvent);

// Route for updating a user
app.post('/:eventId/updateUser', userController.updateUser);

// Use the form submission routes
app.use('/formSubmission', formSubmissionRoutes);

// Start the server........................................
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
