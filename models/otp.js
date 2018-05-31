const mongoose = require('mongoose');

var otpSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    minlength: 1
  },
  otp: {
    type: String,
    required: true,
    length: 5,
  },
  contactNumber: {
    type: String,
    required: true,
    length: 10,
  }
});

otpSchema.index({
    "$**" : "text"
},
{
    "expireAfterSeconds" : 900,
    "name" : "otpExpire"
});


var Otp = mongoose.model('Otp', otpSchema);

module.exports = {Otp};
