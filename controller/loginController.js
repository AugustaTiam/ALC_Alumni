const UserSign = require('../model/userModel');
const bcrypt = require('bcrypt');

const loginController = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username in the database
    const user = await UserSign.findOne({ userName: username });

    // Check if the user exists and the password is correct
    if (user && (await bcrypt.compare(password, user.password))) {
      // Successful login
      // Check the user's role and redirect accordingly
      if (user.role === 'admin') {
        // Redirect to the admin dashboard
        res.redirect('/adminDashboard');
      } else {
        // Redirect to the user's dashboard or home page
        res.redirect('/');
      }
    } else {
      // Incorrect username or password
      // Send a response to the client indicating the failure
      res.status(401).send('Incorrect username or password');
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
};

module.exports = loginController;