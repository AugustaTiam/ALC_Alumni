const FormSubmission = require('../model/formSubmissionModel');

const contactUsController = async (req, res) => {
  try {
    const { firstName, lastName, emailAddress, message } = req.body;

    // Save the form submission to MongoDB
    const formSubmission = new FormSubmission({
      firstName,
      lastName,
      emailAddress,
      message,
    });
    await formSubmission.save();

    // Send a response to the client
    res.send('Message sent successfully!');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
};

module.exports = contactUsController;
