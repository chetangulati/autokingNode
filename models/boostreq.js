const mongoose = require('mongoose');

var boostSchema = new mongoose.Schema({
  serviceProvider:{
    type: String,
    required: true,
    minlength: 1,
  },
  pack: {
    type: String,
    required: true,
    minlength: 1,
  },
  message: {
    type: String,
    required: true,
    minlength: 1,
  },
  date: {
    type: Date,
    default: new Date(),
  },
  approved: {
    type: Boolean,
    default: false,
  },
  customer:[{
    customerId: {
      type: String,
      minlength: 1,
    }
  }]
});

var BoostReq = mongoose.model('boostreq', boostSchema);

module.exports = {BoostReq};
