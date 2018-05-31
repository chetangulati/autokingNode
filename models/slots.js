const mongoose = require('mongoose');

var slotSchema = new mongoose.Schema({
  serviceProvider:{
    type: String,
    required: true,
    minlength: 1,
  },
  slotStart: {
    type: Number,
    required: true,
    minlength: 1,
  },
  slotEnd: {
    type: Number,
    required: true,
    minlength: 1,
  }
});

var Slot = mongoose.model('slot', slotSchema);

module.exports = {Slot};
