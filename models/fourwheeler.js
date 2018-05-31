const mongoose = require('mongoose');

var fourWheelerSchema = new mongoose.Schema({
  "brand":{
    type: String,
    required: true,
    minlength: 1,
    unique: true,
  },
  "models":[{  "name":{
      type: String,
      required: true,
      minlength: 1,
      unique: true,
    },
    "cartype":{
      type: String,
      required: true,
      minlength: 1
    },
    "petrol":{
      type: Boolean,
      default: false,
    },
    "petrolauto":{
      type: Boolean,
      default: false,
    },
    "diesel":{
      type: Boolean,
      default: false
    },
    "dieselauto":{
      type: Boolean,
      default: false
    },
    "hybrid":{
      type: Boolean,
      default: false
    },
    "cng":{
      type: Boolean,
      default: false,
    },
    "electric":{
      type: Boolean,
      default: false
    }
  }],
});

fourWheelerSchema.index({'$**': "text"});

var fourWheeler = mongoose.model('fourWheeler', fourWheelerSchema);

module.exports = {fourWheeler};
