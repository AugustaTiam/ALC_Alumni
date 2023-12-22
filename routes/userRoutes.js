const express = require('express');
const userController = require('../controller/userController');
const router = express.Router();
const UserSign = require('../model/eventModel');

// Signup route
router.post('/signup', userController.signUpController);

// Fetch all users route
router.get('/allUsers', userController.getAllUsers);

// Update user route
router.post('/:userId/updateUser', userController.updateUser);


router.get('/:userId', userController.getUserById);

// Delete user route
router.delete('/:userId/deleteUser', userController.deleteUser);

module.exports = router;
