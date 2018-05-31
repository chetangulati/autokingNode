const mongoose = require('mongoose');

var tipsSchema = new mongoose.Schema({
  tips:{
    type: String,
    required: true,
    minlength: 1,
  },
  date: {
    type: Date,
    default: new Date(),
  }
});
var Tip = mongoose.model('tip', tipsSchema);


module.exports = {Tip};
