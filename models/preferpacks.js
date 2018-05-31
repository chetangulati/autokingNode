const mongoose = require('mongoose');

var preferpackSchema = new mongoose.Schema({
  price:{
    type: Number,
    required: true,
    minlength: 1,
  }
});

var Preferpack = mongoose.model('preferpack', preferpackSchema);

module.exports = {Preferpack};
