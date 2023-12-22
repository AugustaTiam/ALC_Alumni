const mongoose = require('mongoose');

const formSubmissionSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  emailAddress: String,
  message: String,
});

const FormSubmission = mongoose.model('FormSubmission', formSubmissionSchema);

module.exports = FormSubmission;
