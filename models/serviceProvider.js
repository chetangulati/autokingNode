const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var ServiceProviderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
  },
  address:{
    type: String,
    required: true,
    minlength: 1
  },
  twowheeler:{
    type: Boolean,
    default: false,
  },
  fourwheeler:{
    type: Boolean,
    default: false,
  },
  rsa:{
    type: Boolean,
    default: false,
  },
  vacation: {
    type: Boolean,
    default: false
  },
  pickndrop:{
    type: Boolean,
    default: false
  },
  lat:{
    type: Number,
    minlength: 1,
    required: true
  },
  lng:{
    type: Number,
    minlength: 1,
    required: true
  },
  owner:{
    type: String,
    minlength: 1,
    required: true
  },
  email: {
    type: String,
    required: true,
    minlength: 1,
    unique: true,
    trim: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid E-Mail'
    }
  },
  contact: {
    type: String,
    required: true,
    unique: true,
    length: 10,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  adhaar:{
    type: Number,
    required: true,
    length: 12
  },
  docsVerified: {
    type: Boolean,
    default: false
  },
  stepone:{
    type: Boolean,
    default: false
  },
  steptwo:{
    type: Boolean,
    default: false
  },
  stepthree:{
    type: Boolean,
    default: false
  },
  approved: {
    type: Boolean,
    default: false
  },
  contactVerified: {
    type: Boolean,
    default: false
  },
  balance: {
    type: Number,
    required: true,
    default: 0
  },
  toeing_hatchback: {
    type: Number,
    minlength: 1
  },
  toeing_sedan: {
    type: Number,
    minlength: 1
  },
  toeing_suv: {
    type: Number,
    minlength: 1
  },
  toeing_crossover: {
    type: Number,
    minlength: 1
  },
  toeing_miniSuv: {
    type: Number,
    minlength: 1
  },
  batteryJumpstart: {
    type: Number,
    minlength: 1
  },
  flatTire: {
    type: Number,
    minlength: 1
  },
  lockedOut:{
    type: Number,
    minlength: 1
  },
  fuelProblem: {
    type: Number,
    minlength: 1
  },
  minorRepair:{
    type: Number,
    minlength: 1
  },
  medical:{
    type: Number,
    minlength: 1
  },
  adhaarpic:{
    type: String,
    minlength: 1,
    required: true,
  },
  profileImg:{
    type: String,
    minlength: 1,
    default: "images/default.png"
  },
  credit:[{
    transactionId: {
      type: String,
      required: true,
      minlength: 1
    },
    comment: {
      type: String,
      minlength: 1,
    },
    type: {
      type: String,
      required: true,
      minlength: 1,
    },
    dnt: {
      type: Date,
      default: new Date(),
      required: true,
    }
  }],
  debit:[{
    transactionId: {
      type: String,
      required: true,
      minlength: 1
    },
    comment: {
      type: String,
      minlength: 1,
    },
    type: {
      type: String,
      required: true,
      minlength: 1,
    },
    dnt: {
      type: Date,
      default: new Date(),
      required: true,
    }
  }],
  vehicles:[{
    name:{
      type: String,
      minlength: 1
    },
    two: {
      type: Boolean,
      default: false,
    },
    fuel:{
      type: String,
      minlength: 1,
      default: 0,
    },
    GeneralServices: {
        type: String,
        minlength: 1,
        default: 0,
    },
    servicePrice: {
      type: Number,
      minlength: 1,
      default: 0,
    },
    engineOil:{
      type: Number,
      minlength: 1,
      default: 0,

    },
    oilFilter:{
      type: Number,
      minlength: 1,
      default: 0,

    },
    airFilter:{
      type: Number,
      minlength: 1,
      default: 0,
    },
    fuelFilter:{
      type: Number,
      minlength: 1,
      default: 0,
    },
    sparkPlugs:{
      type: Number,
      minlength: 1,
      default: 0,
    },
    tuning:{
      type: Number,
      minlength: 1,
      default: 0,
    },
    brakeFluid:{
      type: Number,
      minlength: 1,
      default: 0,
    },
    clutchFluid:{
      type: Number,
      minlength: 1,
      default: 0,

    },
    brakePads:{
      type: Number,
      minlength: 1,
      default: 0,

    },
    manualTransmissionFluid:{
      type: Number,
      minlength: 1,
      default: 0,

    },
    automaticTransmissionFluid:{
      type: Number,
      minlength: 1,
      default: 0,

    },
    powerSteeringFluid:{
      type: Number,
      default: 0,

      minlength: 1,
    },
    timingBelt:{
      type: Number,
      default: 0,
      minlength: 1,

    },
    lights:{
      type: Number,
      default: 0,
      minlength: 1,

    },
    wipers:{
      type: Number,
      default: 0,
      minlength: 1,

    },
    ecuCorrection:{
      type: Number,
      default: 0,

      minlength: 1,
    },
    exteriorCleaning:{
      type: Number,
      default: 0,
      minlength: 1,

    },
    interiorCleaning:{
      type: Number,
      default: 0,
      minlength: 1,

    },
    scanCar:{
      type: Number,
      default: 0,
      minlength: 1,

    },
    batteryCharge:{
      type: Number,
      default: 0,
      minlength: 1,

    },
    wheelAlignment:{
      type: Number,
      default: 0,
      minlength: 1,

    },
    wheelBalancing:{
      type: Number,
      default: 0,
      minlength: 1,

    },
    smallDent:{
      type: Number,
      default: 0,
      minlength: 1,

    },
    mediumDent:{
      type: Number,
      default: 0,
      minlength: 1,

    },
    largeDent:{
      type: Number,
      default: 0,

      minlength: 1,
    },
    labourCost:{
      type: Number,
      default: 0,
      minlength: 1,

    },
    coolant:{
      default: 0,
      type: Number,
      minlength: 1,

    },
    tyreReplacement: {
      type: Number,
      default: 0,
      minlength: 1,
    },
    valveAdjustments: {
      type: Number,
      default: 0,
      minlength: 1
    },
    forkSeal: {
      type: Number,
      default: 0,
      minlength: 1
    },
    chainandsprockets: {
      default: 0,
      type: Number,
      minlength: 1
    },
  }],
  tokens: [{
    access: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    }
  }]
});

ServiceProviderSchema.methods.generateAuthToken = function () {
  var sp = this;
  var access = 'auth';
  var token = jwt.sign({_id: sp._id.toHexString(), access}, 'autoKing').toString();

  sp.tokens.push({access, token});

  return sp.save().then(() => {
    return token;
  });
};

ServiceProviderSchema.methods.toJSON = function () {
  var sp = this;
  var spObject = sp.toObject();

  return _.pick(spObject, ['_id', 'email', 'name','address','vacation', 'stepone', 'steptwo', 'stepthree','toeing_hatchback', 'toeing_sedan',  'toeing_suv',  'toeing_crossover', 'toeing_miniSuv',  'batteryJumpstart',  'flatTire',  'lockedOut', 'fuelProblem', 'minorRepair','medical' ,'pickndrop','twowheeler', 'fourwheeler','docsVerified','approved', 'vehicles', 'rsa']);
};


ServiceProviderSchema.methods.removeToken = function (token) {
  var sp = this;

  return sp.update({
    $pull: {
      tokens: {token}
    }
  });
};

ServiceProviderSchema.statics.findByToken = function (token) {
  var ServiceProvider = this;
  var decoded;

  try {
    decoded = jwt.verify(token, 'autoKing');
  } catch (e) {
    return Promise.reject();
  }

  return ServiceProvider.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

ServiceProviderSchema.statics.findByCredentials = function (email, password) {
  var ServiceProvider = this;

  return ServiceProvider.findOne({email}).then((sp) => {
    if (!sp) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      // Use bcrypt.compare to compare password and sp.password
      bcrypt.compare(password, sp.password, (err, res) => {
        if (res) {
          resolve(sp);
        } else {
          reject();
        }
      });
    });
  });
};

ServiceProviderSchema.pre('save', function (next) {
  var sp = this;

  if (sp.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(sp.password, salt, (err, hash) => {
        sp.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});


var ServiceProvider = mongoose.model('ServiceProvider', ServiceProviderSchema);

module.exports = {ServiceProvider};
