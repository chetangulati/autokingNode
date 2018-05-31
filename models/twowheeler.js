const mongoose = require('mongoose');

var twoWheelerSchema = new mongoose.Schema({
  "brand":{
    type: String,
    required: true,
    minlength: 1,
    unique: true,
  },
  "models":[{  "name":{
      type: String,
      required: true,
      minlength: 1
    },
    "automatic":{
      type: Boolean,
      default: false,
    },
    "electric":{
      type: Boolean,
      default: false
    }
  }],
});

twoWheelerSchema.index({'$**': "text"});

var twoWheeler = mongoose.model('twoWheeler', twoWheelerSchema);

module.exports = {twoWheeler};
