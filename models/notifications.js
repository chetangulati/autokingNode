const mongoose = require('mongoose');

var notificationSchema = new mongoose.Schema({
  notification:{
    type: String,
    required: true,
    minlength: 1,
  },
  date: {
    type: Date,
    default: new Date(),
  },
  serviceProvider: {
    type: String,
    required: true,
    minlength: 1,
  }
});

var Notify = mongoose.model('notifications', notificationSchema);

module.exports = {Notify};
