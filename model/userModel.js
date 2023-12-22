const mongoose = require('mongoose');

const userSignSchema = new mongoose.Schema({
  userName: String,
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  location: String,
  yearGroup: String,
  password: String,
  role: { type: String, default: 'user' },
});

const UserSign = mongoose.model('UserSign', userSignSchema);

module.exports = UserSign;