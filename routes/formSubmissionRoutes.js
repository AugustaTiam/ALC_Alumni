const express = require('express');
const contactUsController = require('../controller/formSubmissionController');
const router = express.Router();

// Contact us route
router.post('/contact', contactUsController);

module.exports = router;
