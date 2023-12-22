const UserSign = require('../model/userModel');
const path = require('path');
const bcrypt = require('bcrypt');

exports.signUpController = async (req, res) => {
  try {
    const { userName, email, location, yearGroup, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user details to MongoDB
    const userSign = new UserSign({
      userName,
      email,
      location,
      yearGroup,
      password: hashedPassword,
    });
    await userSign.save();

    // Send a response to the client
    res.redirect('/');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    // Fetch all users from MongoDB
    const users = await UserSign.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { userName, location, yearGroup } = req.body;

    // Find the user by ID and update the details
    const updatedUser = await UserSign.findById(userId)(
      userId,
      { userName, location, yearGroup },
      { new: true } // Return the updated user
    );

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by ID and delete
    const deletedUser = await UserSign.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).send('User not found');
    }

    res.status(200).send('User deleted successfully');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await UserSign.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  } else {
    res.status(403).send('Access Denied: You do not have permission to access this page.');
  }
};

// Apply the isAdmin middleware to the entire admin route
// router.use(isAdmin);

// Admin dashboard route
// router.get('/dashboard', async (req, res) => {
//   try {
    
// Fetch and display the list of subscribed users
//     const userSign = await UserSign.find();

// Render the adminDashboard.html file
//     res.sendFile(__dirname + '/../public/adminDashboard.html');
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).send('Internal Server Error: ' + error.message);
//   }
// });