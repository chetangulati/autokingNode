const mongoose = require('mongoose');

var goAuthSchema = new mongoose.Schema({
  "userId":{
    type: String,
    required: true,
    minlength: 1
  },
  "refresh_token": {
    type: String,
    required: true,
    minlength: 1
  },
  "access_token":{
    type: String,
    required: true,
    minlength: 1
  },
  "expiry": {
    type: Date,
    required: true,
  },
  "oauthid": {
    type: Number,
    required: true,
    minlength: 1
  },

});


var goAuth = mongoose.model('goauth', goAuthSchema);

module.exports = {goAuth};
