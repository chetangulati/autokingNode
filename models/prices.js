const mongoose = require('mongoose');

var pricesSchema = new mongoose.Schema({
  hatchGold:{
    type: Number,
    default: 0,
    required: true,
    minlength: 1,
  },
  sedanGold:{
    type: Number,
    default: 0,
    required: true,
    minlength: 1,
  },
  miniSuvGold:{
    type: Number,
    default: 0,
    required: true,
    minlength: 1,
  },
  suvGold:{
    type: Number,
    default: 0,
    required: true,
    minlength: 1,
  },
  hatchSilver:{
    type: Number,
    default: 0,
    required: true,
    minlength: 1,
  },
  sedanSilver:{
    type: Number,
    default: 0,
    required: true,
    minlength: 1,
  },
  miniSuvSilver:{
    type: Number,
    default: 0,
    required: true,
    minlength: 1,
  },
  suvSilver:{
    type: Number,
    default: 0,
    required: true,
    minlength: 1,
  },
  hatchBronze:{
    type: Number,
    default: 0,
    required: true,
    minlength: 1,
  },
  sedanBronze:{
    type: Number,
    default: 0,
    required: true,
    minlength: 1,
  },
  miniSuvBronze:{
    type: Number,
    default: 0,
    required: true,
    minlength: 1,
  },
  suvBronze:{
    type: Number,
    default: 0,
    required: true,
    minlength: 1,
  },
});

var Prices = mongoose.model('price', pricesSchema);

module.exports = {Prices};
