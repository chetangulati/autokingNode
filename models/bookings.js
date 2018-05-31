const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

var conn = mongoose.createConnection("mongodb://localhost:27017/autoKing");

autoIncrement.initialize(conn);

var bookingSchema = new mongoose.Schema({
  serviceProvider: {
    type: String,
    required: true,
    minlength: 1
  },
  customer: {
    type: String,
    required: true,
    minlength: 1
  },
  slot:[{
    type: Number
  }],
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: Date,
    required: true,
    default: new Date(),
  },
  services: [{
    type: Number
  }],
  estimate: [{
    name: {
      type: String,
      minlength: 1,
    },
    price:{
      type: Number,
      minlength: 1,
    },
    quantity: {
      type: Number,
      minlength: 1,
    },
    total:{
      type: Number,
      minlength: 1,
    }
  }],
  otp:{
    type: Number,
    default: Math.floor(10000 + Math.random() * 90000),
  },
  grandTotal:{
    type: Number,
    minlength: 1,
  },
  transactionId:{
    type: String,
    minlength: 1,
  },
  paymentMode:{
    type: String,
    minlength: 1,
  },
  vehicle: {
    type: String,
    required: true,
    minlength: 1,
  },
  fuel: {
    type: String,
    required: true,
    minlength: 1,
  },
  pnd: {
    type: Boolean,
    required: true,
    default: false,
  },
  pndAddress: {
    type: String,
    minlength: 1,
  },
  pickupContact: {
    type: Number,
    length: 10,
  },
  pickupName: {
    type: String,
    minlength: 1,
  },
  pickupTime: {
    type: String,
    minlength: 1,
  },
  pickedup:{
    type: Boolean,
    default: false
  },
  accepted: {
    type: Boolean,
    default: false,
  },
  veharrived: {
    type: Boolean,
    default: false,
  },
  estimateApproved: {
    type: Boolean,
    default: false,
  },
  bookingComplete: {
    type: Boolean,
    default: false,
  },
  paymentdone: {
    type: Boolean,
    default: false,
  },
  cancelled: {
    type: Boolean,
    default: false,
  }
});

bookingSchema.plugin(autoIncrement.plugin, {
    model: 'Book',
    field: 'bookId',
    startAt: 100000,
    incrementBy: 1
});

var Booking = mongoose.model('booking', bookingSchema);

module.exports = {Booking};
