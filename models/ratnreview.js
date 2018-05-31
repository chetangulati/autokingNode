const mongoose = require('mongoose');

var ratnreview = new mongoose.Schema({
  serviceProvider: {
    type: String,
    required: true,
    minlength: 1,
  },
  customer: {
    type: String,
    required: true,
    minlength: 1,
  },
  rating: {
    type: Number,
    required: true,
    minlength: 1,
  },
  review: {
    type: String,
  },
  time: {
    type: Date,
    required: true,
    default: new Date(),
  }
});

var Ratnrev = mongoose.model('ratnrev', ratnreview);
module.exports = {Ratnrev};
