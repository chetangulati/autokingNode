const mongoose = require('mongoose');

var preferSchema = new mongoose.Schema({
  serviceProvider:{
    type: String,
    required: true,
    minlength: 1,
  },
  pack: {
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

var PreferReq = mongoose.model('preferReq', preferSchema);

module.exports = {PreferReq};
