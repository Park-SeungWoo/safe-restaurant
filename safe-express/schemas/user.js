const mongoose = require('mongoose');

const { Schema } = mongoose;
const userSchema = new Schema({
  token: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  age_range: {
    type: String,
    required: true,
  },
  nickname:{
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('user', userSchema);