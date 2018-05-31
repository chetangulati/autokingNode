const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/autoKing', (err, db) => {
  if(err) return console.log('Unable to connect to database');
  console.log('Connected to server successfully');
});

module.exports = {mongoose};
