const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const _ = require('lodash');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const request = require('request');
var ObjectId = require('mongoose').Types.ObjectId;

const {Booking} = require('./models/bookings.js');
const {mongoose} = require('./db/mongoose');
const {User} = require('./models/user');
const {goAuth} = require('./models/goauth');
const {Ratnrev} = require('./models/ratnreview');
const {ServiceProvider} = require('./models/serviceProvider');
const {Otp} = require('./models/otp');
const {authenticate} = require('./middleware/authenticate');
const {check} = require('./middleware/authenticate');
const {fourWheeler} = require('./models/fourwheeler');
const {twoWheeler} = require('./models/twowheeler');
const {OAuth2Client} = require('google-auth-library');
const keys = require('./keys.json');


const txtapikey = encodeURIComponent("BcQat1CE15U-EM1j183bK4thf0bZRTP7poLsgGcdAz");
const txthash = "e41aa71423a43a2e0dbe369c8971279a56aa2c7468c2ea7c21de106c0c1bfecd";


const oAuth2Client = new OAuth2Client(
  keys.web.client_id,
  keys.web.client_secret,
  keys.web.redirect_uris[0]
);

var app = express();

app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(express.static(__dirname + '/static'));
app.use('/' ,express.static(__dirname + '/views/customer'));
app.set('view engine', 'hbs')

app.get('/', check, (req, res) => {
  if (req.user) {
    res.render('customer/index.hbs', {loggedIn: "<a href='/profile'>"+ req.user.name +"</a>"});
  }
  else {
    res.render('customer/index.hbs', {loggedIn: "<a href='/login' >Login & Signup</a>"});
  }
});

app.get('/about', check,  (req, res) => {
  if (req.user) {
    res.render('customer/about.hbs', {loggedIn: "<a href='/profile'>"+ req.user.name +"</a>"});
  }
  else {
    res.render('customer/about.hbs', {loggedIn: "<a href='/login' >Login & Signup</a>"});
  }
});


app.get('/rsa', check,  (req, res) => {
  if (req.user) {
    res.render('customer/rsa.hbs', {loggedIn: "<a href='/profile'>"+ req.user.name +"</a>"});
  }
  else {
    res.render('customer/rsa.hbs', {loggedIn: "<a href='/login' >Login & Signup</a>"});
  }
});

app.get('/login', (req, res) =>{
  var next = encodeURI(req.query.next);
  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/plus.me'
  });
  if (next == "undefined") {
    res.cookie('next', next, {httpOnly: true, maxAge: 600, sameSite: true}).render('customer/login.hbs', {next: next, glogin: authorizeUrl});
  }
  else {
    res.render('customer/login.hbs', {next: next, glogin: authorizeUrl});
  }
});

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

app.get('/oauth2callback', (req, res)=>{
  const qs = req.query.code;
  const url = ['https://www.googleapis.com/plus/v1/people/userinfo.email?userId=me', 'https://www.googleapis.com/auth/plus.login'];
  var next = req.cookies.next

  oAuth2Client.getToken(qs).then((r) => {
    oAuth2Client.setCredentials(r.tokens);
      oAuth2Client.request({url}).then((response) =>{
        goAuth.findOne({"oauthid": response.data.id}, 'userId').then((data) =>{
          User.findOne({'_id': data}).then((sp) => {
            if (sp) {
              return sp.generateAuthToken().then((token) => {
                res.header('x-auth', token).cookie('xauth', token, {httpOnly: true, maxAge: 2592000000, sameSite: true}).redirect(next);
              });
            }
            else {
              res.send(response.data);
              // res.redirect(encodeURI(`/oauthregister?name=${response.data.displayName}&email=${response.data.email}`));
            }
          }).catch((e)=>{
            res.redirect("/login?error4=" + e);
          });
        }).catch((e) =>{
          res.redirect("/login?error1=" + e);
        });
      }).catch((e) => {
        res.redirect("/login?error2=" + e);
      });
  }).catch((e) =>{
    res.redirect("/login?error3=" + e);
  });
});

app.post("/confirmotp", authenticate, (req, res) => {
  var otp = req.body.otp;
  var id = req.body.bookingid;
  Booking.findOne({'bookId': id}).then((e) => {
    if (e.otp == otp) {
      Booking.update({bookId: e.bookId},{$set:{pickedup: true}}).then((a) =>{
        res.send("Agent verified, you can give the vehicle to agent now");
      });
    }
    else {
      res.status(200).send("We can't verify the otp. Please re-enter the correct otp");
    }
  }).catch((e)=>{
    res.status(400).send(e);
  });
});

app.post("/cancel", authenticate, async (req, res) => {
  var bookId = req.body.id;
  var picked = await Booking.findOne({$and: [{bookId: bookId},{customer: req.user._id}]});
  if (picked.pickedup) {
    res.status(400).send("Booking can't be cancelled once the vehicle has been picked up");
  }
  else {
    Booking.update({bookId: bookId},{$set: {cancelled: true}}).then((e) => {
      res.status(200).send("Booking has been cancelled successfully");
    }).catch((e) => {
      console.log(e);
    });
  }
});

app.get('/track', authenticate, async (req, res) => {
  if (!req.query.bookid) {
    res.redirect("/error");
  }
  else {
    var bookid = req.query.bookid;
    try {
      var booking = await Booking.findOne({$and: [{"bookId": bookid},{"customer": req.user._id}]});
      if (booking.pnd && booking.pickedup == false) {
        var confirmOtp = '<div class="pickup"><h2>Vehicle Pickup</h2><form method="post" id="cnfirm"><input type="hidden" name="bookingid" value="'+ booking.bookId +'"><input type="text" name="otp" placeholder="Take OTP from pickup man"><button type="submit" name="otpConfirm">Confirm pickup</button></form></div>';
      }
      else {
        var confirmOtp = "";
      }
      var sp = await ServiceProvider.findOne({'_id': booking.serviceProvider});
      var veh = booking.vehicle.replace(/_/g, " ");
      var services = ["General Service", "Oil Change", "Complete Breakdown", "Clutch and Brakes Issue", "Electrical Issue", "Filter change", "Re-Painting/Scratch Removal", "Tyre Puncture/Replacement", "Parts Change", "Other"];
      var reqServices = "";
      for (var i = 0; i < booking.services.length; i++) {
          reqServices += '<li>'+ services[booking.services[i]-1] +'</li>';
      }
      if (booking.estimate.length == 0) {
        var est = "";
      }
      else {

      }
      if (booking.pickedup == true && booking.veharrived == false && booking.bookingComplete == false) {
        var track = "20%";
      }
      else if (booking.pickedup == true && booking.veharrived == true && booking.bookingComplete == false) {
        var track = "50%";
      }
      else if (booking.pickedup == true && booking.veharrived == true && booking.bookingComplete == true) {
        var track = "100%";
      }
      else {
        var track = "0%";
      }
        res.render('customer/track.hbs', {confirmOtp: confirmOtp, sp: sp, veh: veh,reqser: reqServices, bookingno: booking.bookId, sp: sp.name, est: est, track: track});
    } catch (e) {
        res.send(e);
        console.log(e);
      }
  }
});

app.get('/book', check, (req, res) => {
  res.render('customer/booking.hbs');
});

app.get('/contact', check, (req, res)=> {
  if (req.user) {
    res.render('customer/contact.hbs', {loggedIn: "<a href='/profile'>"+ req.user.name +"</a>"});
  }
  else {
    res.render('customer/contact.hbs', {loggedIn: "<a href='/login' >Login & Signup</a>"});
  }
});

app.get('/profile', authenticate, (req, res) => {
  res.render('customer/customer.hbs');
});

app.get('/list', authenticate, async (req, res) => {
  if (!req.query.type) {
    if(!req.query.vehicleType){
      res.redirect('/book');
      // ServiceProvider.find({""})
    }
    else{
      if (req.query.vehicleType == "4") {
        var vehicle = req.query.brand+"_"+req.query.model+"_"+req.query.fuel;
      }
      else if (req.query.vehicleType == "2") {
        var vehicle = req.query.brand+"_"+req.query.model;
      }
      try {
        const sp = await ServiceProvider.find({$and: [{"vehicles.name":{$regex: '^'+vehicle, $options: 'i'}},{'vacation': false}]});
        var spList = "";
        for (var i = 0; i < sp.length; i++) {
          const rat = await Ratnrev.find({serviceProvider: sp[i]._id});
          var sprating = 0;
          var count = 1;
          for (var j = 0; j < rat.length; j++) {
            sprating += rat[rating];
            count++;
          }
          var serv ="";
          for (var k = 0; k< req.query.service.length; k++) {
            serv += `&service=${req.query.service[k]}`;
          }
          var Rating = ((sprating/count)/5)*100;
          spList+=`<a href="/serviceprovider?sp=${sp[i]._id}&vehicleType=${req.query.vehicleType}&brand=${req.query.brand}&model=${req.query.model}&fuel=${req.query.fuel}&lat=${req.query.lat}&lng=${req.query.lng}${serv}"><div class="card shdw1"><img src="${sp[i].profileImg}" alt="${sp[i].owner}"><div class="info"><h2>${sp[i].owner}</h2><p>${sp[i].address}</p><div class="rating"><div class="greystars"></div><div class="filledstars" style="width:${Rating}%"></div></div></div></div></a>`;
        }
        res.render('customer/list.hbs', {spList: spList});
      } catch (e) {
        console.log(e);
      }
    }
  }
  else {
    var veh = req.query.type;
    var rsa = req.query.rsa;
    try {
      const sp = await ServiceProvider.find({$and: [{"rsa": true},{'vacation': false}]});
      var spList = "";
      for (var i = 0; i < sp.length; i++) {
        const rat = await Ratnrev.find({serviceProvider: sp[i]._id});
        var sprating = 0;
        var count = 1;
        for (var j = 0; j < rat.length; j++) {
          sprating += rat[rating];
          count++;
        }
        var Rating = ((sprating/count)/5)*100;
        spList+=`<a href="/serviceprovider?sp=${sp[i]._id}"><div class="card shdw1"><img src="${sp[i].profileImg}" alt="${sp[i].owner}"><div class="info"><h2>${sp[i].owner}</h2><p>${sp[i].address}</p><div class="rating"><div class="greystars"></div><div class="filledstars" style="width:${Rating}%"></div></div></div></div></a>`;
      }
      res.render('customer/list.hbs', {spList: spList});
    } catch (e) {
      console.log(e);
    }
  }
});

app.get('/serviceprovider', authenticate, async (req, res) => {
  if (!req.query.sp && !req.query.service && !req.query.model) {
    res.redirect('/book');
  }
  else {
    try {
      const sp = await ServiceProvider.findOne({_id: req.query.sp});
      if (sp.pickndrop == "true") {
        var pnd = "Pick and drop available";
      }
      else {
        var pnd = "";
      }
      if (req.query.vehicleType == "4") {
        var vehicle = req.query.brand+"_"+req.query.model+"_"+req.query.fuel;
        var displayVehicle= req.query.brand+" "+req.query.model+" "+req.query.fuel;
      }
      else if (req.query.vehicleType == "2") {
        var vehicle = req.query.brand+"_"+req.query.model;
        var displayVehicle = req.query.brand+" "+req.query.model;
      }
      var regex = new RegExp('^' + vehicle, 'gi');
      var veh = _.filter(sp.vehicles, obj => regex.test(obj.name));
      var prices = {
        "Engine Oil": veh[0].engineOil,
        "Oil Filter": veh[0].oilFilter,
        "Air Filter": veh[0].airFilter,
        "Fuel Filter": veh[0].fuelFilter,
        "Spark Plugs": veh[0].sparkPlugs,
        "Tuning": veh[0].tuning,
        "Brake Fluid": veh[0].brakeFluid,
        "Clutch Fluid": veh[0].clutchFluid,
        "Brake Pads": veh[0].brakePads,
        "Manual Transmission Fluid": veh[0].manualTransmissionFluid,
        "Automatic Transmission Fluid": veh[0].automaticTransmissionFluid,
        "power Steering Fluid": veh[0].powerSteeringFluid,
        "Timing Belt": veh[0].timingBelt,
        "Lights": veh[0].lights,
        "Wipers": veh[0].wipers,
        "Ecu Correction": veh[0].ecuCorrection,
        "Exterior Cleaning":veh[0].exteriorCleaning,
        "Interior Cleaning":veh[0].interiorCleaning,
        "Scan Car": veh[0].scanCar,
        "Battery Charge":veh[0].batteryCharge,
        "Wheel Alignment": veh[0].wheelAlignment,
        "Wheel Balancing": veh[0].wheelBalancing,
        "Small Dent": veh[0].smallDent,
        "Medium Dent": veh[0].mediumDent,
        "Large Dent": veh[0].largeDent,
        "Labour Cost": veh[0].labourCost,
        "Coolant": veh[0].coolant,
        "Tyre Replacement": veh[0].tyreReplacement,
        "Valve Adjustments": veh[0].valveAdjustments,
        "Fork Seal": veh[0].forkSeal,
        "Chain And Sprockets": veh[0].chainandsprockets
      }
      var servicePrices = `<table><tr><td class="head">General Servicing <br> (${veh[0].GeneralServices})</td><td class="money">Rs. ${veh[0].servicePrice}</td></tr>`;
      for (var i in prices) {
        if (prices[i] != 0) {
          servicePrices += `<tr><td class="head">${i}</td><td class="money">Rs. ${prices[i]}</td></tr>`;
        }
      }
      res.render('customer/details.hbs', {name: sp.owner, address: sp.address, pnd: pnd, veh: displayVehicle,prices:  servicePrices + "</table>", rating: "width: 70%", ratingCount: "540", umob: req.user.contact, uemail: req.user.email});
    } catch (e) {
      console.log(e);
      res.redirect('/error');
    }
  }
});

app.post('/bookingotp', authenticate, async (req, res) => {
  var otp = Math.floor(10000 + Math.random() * 90000);
  var body = {
    'createdAt': new Date(),
    'otp': otp,
    'contactNumber': req.body.mob,
  };
try {
		var number = encodeURIComponent(body.contactNumber);
		var sender = encodeURIComponent("AUTOKI");
		var message = encodeURIComponent("Please enter the OTP "+ otp +" to complete your booking at Autoking.in");

		var data = new Otp(body);
		data.save().then(() => {
			request.post("https://api.textlocal.in/send/",{form:{apikey: txtapikey, numbers: number, sender: sender, message: message}}, (err, response, body)=> {
				if (err) {
					console.log(err);
					res.status(404).send();
				}
				else {
					console.log(body);
					res.status(200).send();
				}
			});
			res.status(200).send();
			console.log('otp sent');
		}).catch((e) => {
			res.status(400).send(e);
		});
} catch (e) {
	console.log(e);
	res.redirect('/error');
}

});

app.post('/booking', authenticate, async (req, res)=> {
  var data = req.body;
  data.customer = req.user._id;
  data.date = new Date(data.date);
  try {
    var otp = await Otp.count({$and: [{"contactNumber": data.mobile},{ "otp": data.otp}]});
    if(otp == 1){
      var book = new Booking(data);
      book.save().then((e) => {
        res.status(200).send("" + e.bookId);
      }).catch((e) => {
        res.status(400).send();
        console.log(e);
      });
    }
    else {
      res.status(400).send("Otp incorrect");
    }
  } catch (e) {
    res.status(400).send();
    console.log(e);
  }
});

app.post('/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password', 'next']);
  var next = (body.next != "undefined")? body.next:'/profile';

  User.findByCredentials(body.email, body.password).then((user) => {
      return user.generateAuthToken().then((token) => {
        res.header('x-auth', token).cookie('xauth', token, {httpOnly: true, maxAge: 2592000000, sameSite: true}).redirect(decodeURIComponent(next));
      });
    }).catch((e) => {
      res.status(401).redirect("/login?error=401");
    });
});

app.post('/register', (req,res) => {
  var body = _.pick(req.body, ['name','email', 'password','contact']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).cookie('xauth', token, {httpOnly: true, maxAge: 2592000000, sameSite: true}).redirect('/profile');
  }).catch((e) => {
    res.status(400).send(e);
  })
});

app.get('/logout', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.clearCookie('xauth');
    res.status(200).redirect('/');
  }, () => {
    res.status(400).redirect('/');
  });
});

app.get('/brand', (req, res) => {
  if (req.query.v == "2") {
    twoWheeler.find({"brand": {$regex: '^'+req.query.q, $options: 'i'}}).then((data) =>{
      var body = [];
      for (var i = 0; i < data.length; i++) {
         body.push(_.pick(data[i], ["brand", "_id"]));
      }
      res.send(body);
    });
  }
  else if (req.query.v == "4") {
    fourWheeler.find({"brand": {$regex: '^'+req.query.q, $options: 'i'}}).then((data) =>{
      var body = [];
      for (var i = 0; i < data.length; i++) {
         body.push(_.pick(data[i], ["brand", "_id"]));
      }
      res.send(body);
    });
  }
});

app.get('/terms', check, (req, res) => {
  if (req.user) {
    res.render('customer/terms.hbs', {loggedIn: "<a href='/profile'>"+ req.user.name +"</a>"});
  }
  else {
    res.render('customer/terms.hbs', {loggedIn: "<a href='/login' >Login & Signup</a>"});
  }
});

app.get('/model', (req, res) => {
  if (req.query.b === "") {
    res.send([{"brand": "Please select brand first", "_id": "0"}]);
  }
  else {
    if (req.query.v == "2") {
      twoWheeler.findOne({"brand": req.query.b}).then((data) =>{
        var body = [];
        for (var i = 0; i < data.models.length; i++) {
           body.push(_.pick(data.models[i], ["name", "_id"]));
        }
        res.send(body);
      });
    }
    else if (req.query.v == "4") {
      fourWheeler.findOne({"brand": req.query.b}).then((data) =>{
        var body = [];
        for (var i = 0; i < data.models.length; i++) {
           body.push(_.pick(data.models[i], ["name", "_id"]));
        }
        res.send(body);
      });
    }
  }
});

module.exports = app;
// app.listen(3000, 'localhost', () => {
//   console.log('Server started at port 3000 successfully');
// });
app.listen(3000, '172.31.17.223', () => {
  console.log('Server started at port 3000 successfully');
});
