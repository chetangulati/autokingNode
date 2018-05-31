const mongoose = require('mongoose');

var boostpackSchema = new mongoose.Schema({
  messages: {
    type: Number,
    required: true,
    minlength: 1,
  },
  price: {
    type: Number,
    required: true,
    minlength: 1,
  }
});

var Boostpack = mongoose.model('boostpack', boostpackSchema);

module.exports = {Boostpack};
