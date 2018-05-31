const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const _ = require('lodash');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const multer = require('multer');
const request = require('request');
const fs = require('fs');
const path = require('path');
const validator = require('validator');

const {Ratnrev} = require('./models/ratnreview')
const {mongoose} = require('./db/mongoose');
const {ServiceProvider} = require('./models/serviceProvider');
const {Booking} = require('./models/bookings.js');
const {Slot} = require('./models/slots');
const {BoostReq} = require('./models/boostreq');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticateSP');
const {stpchk} = require('./middleware/stepchk');
const {fourWheeler} = require('./models/fourwheeler');
const {twoWheeler} = require('./models/twowheeler');
const {Otp} = require('./models/otp');
const {Notify} = require('./models/notifications');
const {Tip} = require('./models/tips');

const txtapikey = encodeURIComponent("BcQat1CE15U-EM1j183bK4thf0bZRTP7poLsgGcdAz");
const txthash = "e41aa71423a43a2e0dbe369c8971279a56aa2c7468c2ea7c21de106c0c1bfecd";

var app = express();

var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, './uploads')
	},
	filename: function(req, file, callback) {
		callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
	}
})

var filefilter = (req, file, cb) => {
	if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png" || file.mimetype === "application/pdf") {
		cb(null, true);
	}
	else {
		cb(null, false);
	}
};

var adhaarupload = multer({
	 storage: storage,
	 limits: {
		 fileSize: 1024*1024*5,
	 },
	 fileFilter: filefilter,
}).single('adhaarpic');

app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(express.static(__dirname + '/static'));
app.use('/' ,express.static(__dirname + '/views/service'));
app.set('view engine', 'hbs');

hbs.registerPartials(__dirname + '/views/service/partials')

hbs.registerHelper('cars', function (data, options) {
  var models = "";
  for (var i = 0; i < data.length; i++) {
    models += '<div class="brand"><h3>'+ data[i].brand +'</h3>';
    for (var j = 0; j < data[i].models.length; j++) {
      for(var key in data[i].models[j]){
        if (data[i].models[j][key] === true && (key == "petrol" || key == "petrolauto" || key == "diesel" || key == "dieselauto" || key == "hybrid" || key == "electric")) {
          models += '<div class="checkbox veh shdw1"><label><input type="checkbox" value="'+ data[i].brand+ '_' + data[i].models[j].name + '_'+ key +'_'+ data[i].models[j]._id+'_four" name="vehicles"/><i class="helper"></i>'+data[i].models[j].name +" "+ key +'</label></div>';
        }
      }
    }
    models += '</div>';
  }
  return models;
});

hbs.registerHelper('bikes', function (data, options) {
  var models = "";
  for (var i = 0; i < data.length; i++) {
    models += '<div class="brand"><h3>'+ data[i].brand +'</h3>';
    for (var j = 0; j < data[i].models.length; j++) {
      models += '<div class="checkbox veh shdw1"><label><input type="checkbox" value="'+ data[i].brand+'_'+ data[i].models[j].name +'_'+ data[i].models[j]._id+'_two" name="vehicles"/><i class="helper"></i>'+ data[i].models[j].name +'</label></div>';
    }
    models += '</div>';
  }
  return models;
});

hbs.registerHelper('pricesTwo', function (data) {
  var form = '';
  for (var i = 0; i < data.length; i++) {
    form += '<div class="model"><h3>'+data[i][0] +' '+data[i][1]+'</h3><div class="genservices"><div class="row"><h4>General Service</h4><div class="form-group"><textarea name="GeneralServices_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'" placeholder="Enter services seperated with commas. For ex: Tuning, oil check, air filter cleaning"></textarea><i class="bar"></i></div></div><div class="row"><h4>General Service price</h4>            <div class="avgPrice">0          </div>            <div class="form-group">              <input type="text" data-inp="number" name="servicePrice_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'" required="required"/>              <label class="control-label" for="text">General service price</label><i class="bar"></i></div>          </div>        </div>        <div class="services">            <h4>Engine Oil</h4>            <div class="avgPrice">              0            </div>              <div class="form-group">                <input type="text" data-inp="number" name="engineOil_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'" required="required"/>                <label class="control-label" for="text">Engine oil price</label><i class="bar"></i>              </div>          </div>         <div class="services">              <h4>Air Filter</h4>              <div class="avgPrice">                0              </div>              <div class="form-group">                <input type="text" data-inp="number" name="airFilter_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'" required="required"/>                <label class="control-label" for="text">Air Filter price</label><i class="bar"></i>       </div>       </div>  <div class="services">              <h4>Tyre Replacement</h4>              <div class="avgPrice">                0              </div>              <div class="form-group">                <input type="text" data-inp="number" name="tyreReplacement_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'" required="required"/>                <label class="control-label" for="text">Air Filter price</label><i class="bar"></i>              </div>          </div><div class="services">              <h4>Battery Charge</h4>              <div class="avgPrice">                0              </div>              <div class="form-group">                <input type="text" data-inp="number" name="batteryCharge_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'" required="required"/>                <label class="control-label" for="text">Air Filter price</label><i class="bar"></i>              </div>          </div><div class="services">              <h4>Battery Change</h4>              <div class="avgPrice">                0              </div>              <div class="form-group">                <input type="text" data-inp="number" name="batterychange_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'" required="required"/>                <label class="control-label" for="text">Air Filter price</label><i class="bar"></i>              </div>          </div><div class="services">              <h4>Wheel Alignment</h4>              <div class="avgPrice">                0              </div>              <div class="form-group">                <input type="text" data-inp="number" name="wheelAlignment_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'" required="required"/>                <label class="control-label" for="text">Air Filter price</label><i class="bar"></i>              </div>          </div><div class="services">              <h4>Wheel Balancing</h4>              <div class="avgPrice">                0              </div>              <div class="form-group">                <input type="text" data-inp="number" name="wheelBalancing_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'" required="required"/>                <label class="control-label" for="text">Air Filter price</label><i class="bar"></i>              </div>          </div>        <div class="services">              <h4>Valve Adjustments</h4>              <div class="avgPrice">                0              </div>              <div class="form-group">                <input type="text" data-inp="number" name="valveAdjustments_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'" required="required"/>                <label class="control-label" for="text">Air Filter price</label><i class="bar"></i>              </div>          </div><div class="services">              <h4>Fork Seal</h4>              <div class="avgPrice">                0              </div>              <div class="form-group">                <input type="text" data-inp="number" name="forkSeal_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'" required="required"/>                <label class="control-label" for="text">Air Filter price</label><i class="bar"></i>              </div>          </div>       <div class="services">              <h4>Chain and Sprockets</h4>              <div class="avgPrice">                0              </div>              <div class="form-group">                <input type="text" data-inp="number" name="chainandsprockets_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'" required="required"/>                <label class="control-label" for="text">Air Filter price</label><i class="bar"></i>              </div>          </div>                                               </div>';
  }
  return form;
});

hbs.registerHelper('pricesFour', function (data) {
  var form = "";

    for (var i = 0; i < data.length; i++) {
      form += '<div class="model"><h3>'+data[i][0] +' '+data[i][1]+ ' '+data[i][2]+'</h3><div class="genservices"><div class="row"><h4>General Service</h4><div class="form-group"><textarea name="GeneralServices_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'_'+ data[i][4] +'" placeholder="Enter services seperated with commas. For ex: Tuning, oil check, air filter cleaning"></textarea><i class="bar"></i></div></div><div class="row"><h4>General Service price</h4>            <div class="avgPrice">0          </div>            <div class="form-group">              <input type="text" data-inp="number" name="servicePrice_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'_'+ data[i][4] +'" required="required"/>              <label class="control-label" for="text">General service price</label><i class="bar"></i></div>          </div>        </div>        <div class="services">            <h4>Engine Oil</h4>            <div class="avgPrice">              0            </div>              <div class="form-group">                <input type="text" data-inp="number" name="engineOil_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'_'+ data[i][4] +'" required="required"/>                <label class="control-label" for="text">Engine oil price</label><i class="bar"></i>              </div>          </div>          <div class="services">              <h4>Oil Filter</h4>              <div class="avgPrice">                0              </div>              <div class="form-group">                <input type="text" data-inp="number" name="oilFilter_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'_'+ data[i][4] +'" required="required"/>                <label class="control-label" for="text">Oil Filter</label><i class="bar"></i>              </div>          </div>          <div class="services">              <h4>Air Filter</h4>              <div class="avgPrice">                0              </div>              <div class="form-group">                <input type="text" data-inp="number" name="airFilter_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'_'+ data[i][4] +'" required="required"/>                <label class="control-label" for="text">Air Filter price</label><i class="bar"></i>              </div>          </div>          <div class="services">              <h4>Fuel Filter</h4>              <div class="avgPrice">                0              </div>              <div class="form-group">                <input type="text" data-inp="number" name="fuelFilter_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'_'+ data[i][4] +'" required="required"/>                <label class="control-label" for="text">Fuel Filter price</label><i class="bar"></i>              </div>          </div>          <div class="services">              <h4>Spark Plugs</h4>              <div class="avgPrice">                0              </div>              <div class="form-group">                <input type="text" data-inp="number" name="sparkPlugs_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'_'+ data[i][4] +'" required="required"/>                <label class="control-label" for="text">Spark Plugs price</label><i class="bar"></i>              </div>          </div>          <div class="services">              <h4>Tuning</h4>              <div class="avgPrice">                0              </div>              <div class="form-group">                <input type="text" data-inp="number" name="tuning_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'_'+ data[i][4] +'" required="required"/>                <label class="control-label" for="text">Tuning price</label><i class="bar"></i>              </div>          </div>          <div class="services">              <h4>Brake Fluid</h4>              <div class="avgPrice">                0              </div>              <div class="form-group">                <input type="text" data-inp="number" name="brakeFluid_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'_'+ data[i][4] +'" required="required"/>                <label class="control-label" for="text">Break Fluid price</label><i class="bar"></i>              </div>          </div>          <div class="services">              <h4>Clutch Fluid</h4>              <div class="avgPrice">                0              </div>              <div class="form-group">                <input type="text" data-inp="number" name="clutchFluid_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'_'+ data[i][4] +'" required="required"/>                <label class="control-label" for="text">Clutch Fluid Price</label><i class="bar"></i>              </div>          </div>          <div class="services">              <h4>Brake Pads</h4>              <div class="avgPrice">                0              </div>              <div class="form-group">                <input type="text" data-inp="number" name="brakePads_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'_'+ data[i][4] +'" required="required"/>                <label class="control-label" for="text">Brake Pads price</label><i class="bar"></i>              </div>          </div>          <div class="services">              <h4>Manual Transmission Fluid</h4>              <div class="avgPrice">                0              </div>              <div class="form-group">                <input type="text" data-inp="number" name="manualTransmissionFluid_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'_'+ data[i][4] +'" required="required"/>                <label class="control-label" for="text">Manual Transmission Fluid Price</label><i class="bar"></i>              </div>          </div>          <div class="services">              <h4>Automatic Transmission Fluid</h4>              <div class="avgPrice">                0              </div>              <div class="form-group">                <input type="text" data-inp="number" name="automaticTransmissionFluid_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'_'+ data[i][4] +'" required="required"/>                <label class="control-label" for="text">Automatic Transmission Fluid Price</label><i class="bar"></i>              </div>          </div>          <div class="services">              <h4>Power Steering Fluid</h4>              <div class="avgPrice">                0              </div>              <div class="form-group">                <input type="text" data-inp="number" name="powerSteeringFluid_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'_'+ data[i][4] +'" required="required"/>                <label class="control-label" for="text">Power Steering Fluid Price</label><i class="bar"></i>              </div>          </div>          <div class="services">              <h4>Timing Chain</h4>              <div class="avgPrice">                0              </div>              <div class="form-group">                <input type="text" data-inp="number" name="timingchain_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'_'+ data[i][4] +'" required="required"/>                <label class="control-label" for="text">Timing Chain Price</label><i class="bar"></i>  </div>          </div>          <div class="services">              <h4>Timing Belt</h4>              <div class="avgPrice">                0              </div>              <div class="form-group">                <input type="text" data-inp="number" name="timingBelt_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'_'+ data[i][4] +'" required="required"/>                <label class="control-label" for="text">Timing Belt Price</label><i class="bar"></i>            </div>          </div>          <div class="services">              <h4>Operation of Lights</h4>              <div class="avgPrice">    0              </div>              <div class="form-group"><input type="text" data-inp="number" name="operationoflights_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'_'+ data[i][4] +'" required="required"/><label class="control-label" for="text">Operation of lights Price</label><i class="bar"></i></div>          </div>          <div class="services"><h4>Operation of Wipers</h4>              <div class="avgPrice">                0              </div>              <div class="form-group"><input type="text" data-inp="number" name="operationofwiper_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'_'+ data[i][4] +'" required="required"/>                <label class="control-label" for="text">Operation of wiper Price</label><i class="bar"></i></div>          </div>          <div class="services">              <h4>ECU Correction</h4>              <div class="avgPrice">              0              </div>              <div class="form-group">                <input type="text" data-inp="number" name="ecuCorrection_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'_'+ data[i][4] +'" required="required"/>                <label class="control-label" for="text">ECU Correction Price</label><i class="bar"></i>  </div>          </div>          <div class="services">              <h4>Cleaning the Exterior</h4>              <div class="avgPrice">  0              </div>              <div class="form-group">                <input type="text" data-inp="number" name="exteriorCleaning_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'_'+ data[i][4] +'" required="required"/>                <label class="control-label" for="text">Cleaning Exterior Price</label><i class="bar"></i>              </div>          </div>          <div class="services">              <h4>Cleaning Interior</h4>              <div class="avgPrice">0              </div>              <div class="form-group">                <input type="text" data-inp="number" name="interiorCleaning_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'_'+ data[i][4] +'" required="required"/><label class="control-label" for="text">Cleaning Interior Price</label><i class="bar"></i>              </div>          </div>          <div class="services">              <h4>Scan the car</h4>              <div class="avgPrice">                0              </div>              <div class="form-group">                <input type="text" data-inp="number" name="scanCar_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'_'+ data[i][4] +'" required="required"/>                <label class="control-label" for="text">Scanning Car Price</label><i class="bar"></i>              </div>          </div>          <div class="services">              <h4>Battery Charge</h4>              <div class="avgPrice">                0              </div>          <div class="form-group">                <input type="text" data-inp="number" name="batteryCharge_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'_'+ data[i][4] +'" required="required"/>                <label class="control-label" for="text">Battery Charge Price</label><i class="bar"></i>              </div>          </div>          <div class="services">              <h4>Wheel Alignment</h4>              <div class="avgPrice">                0              </div>              <div class="form-group">                <input type="text" data-inp="number" name="wheelAlignment_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'_'+ data[i][4] +'" required="required"/>                <label class="control-label" for="text">Wheel Alignment Price</label><i class="bar"></i>              </div>          </div>          <div class="services">              <h4>Wheel Balancing</h4>              <div class="avgPrice">              0              </div>              <div class="form-group">                <input type="text" data-inp="number" name="wheelBalancing_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'_'+ data[i][4] +'" required="required"/>                <label class="control-label" for="text">Wheel Balancing Price</label><i class="bar"></i>              </div>          </div>          <div class="services">              <h4>Small Dent</h4>              <div class="avgPrice">                0              </div>             <div class="form-group">                <input type="text" data-inp="number" name="smallDent_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'_'+ data[i][4] +'" required="required"/>                <label class="control-label" for="text">Small Dent Price</label><i class="bar"></i>            </div>          </div>          <div class="services">              <h4>Medium Dent</h4>              <div class="avgPrice">                0              </div>              <div class="form-group">                <input type="text" data-inp="number" name="mediumDent_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'_'+ data[i][4] +'" required="required"/>                <label class="control-label" for="text">Medium Dent Price</label><i class="bar"></i>              </div>          </div>          <div class="services">              <h4>Large Dent</h4>              <div class="avgPrice">                0              </div>              <div class="form-group">                <input type="text" data-inp="number" name="largeDent_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'_'+ data[i][4] +'" required="required"/>                <label class="control-label" for="text">Large Dent Price</label><i class="bar"></i></div>        </div><div class="services"><h4>Labour Cost</h4><div class="avgPrice">0</div><div class="form-group"><input type="text" data-inp="number" name="labourCost_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'_'+ data[i][4] +'" required="required"/><label class="control-label" for="text">Labour Cost</label><i class="bar"></i></div>          </div><div class="services"><h4>Coolant</h4><div class="avgPrice">0</div><div class="form-group"><input type="text" data-inp="number" name="coolant_'+ data[i][0] +'_'+ data[i][1] + '_' + data[i][2] +'_'+ data[i][3] +'_'+ data[i][4] +'" required="required"/><label class="control-label" for="text">Coolant Price</label><i class="bar"></i></div></div></div>';
    }
  return form;
})


app.get('/login', (req, res) => {
  res.render('service/splogin.hbs', {error: false});
});

app.post('/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password', 'next']);

  ServiceProvider.findByCredentials(body.email, body.password).then((sp) => {
      return sp.generateAuthToken().then((token) => {
          res.header('x-auth', token).cookie('xauth', token, {httpOnly: true, maxAge: 2592000000, sameSite: true}).redirect('/');
      });
    }).catch((e) => {
      res.status(401).render('service/splogin.hbs', {error: true});
    });
});

app.get('/register', (req, res) => {
    fourWheeler.find().then((data) => {
    res.render('service/register.hbs',{fourwheeler: data, whichPartial : function () {
        return "one";
      }
    });
  });
});

app.get('/register/one', (req, res) => {
    res.render('service/register.hbs',{ whichPartial : function () {
        return "one";
      }
    });
});

app.get('/register/two', authenticate, stpchk, async (req, res) => {
try {
	var four = await fourWheeler.find();
	var two = await twoWheeler.find();
	var step = "two";

	if (req.sp.twowheeler === true && req.sp.fourwheeler === true)
	{
		res.render('service/register.hbs',{fourwheeler: four, twowheeler: two, whichPartial : function () {
				return step;
			}
		});
	}
	else if (req.sp.twowheeler === true && req.sp.fourwheeler === false) {
		res.render('service/register.hbs',{fourwheeler: "", twowheeler: two, whichPartial : function () {
			return step;
		}
	});
	}
	else if (req.sp.twowheeler === false && req.sp.fourwheeler === true) {
		res.render('service/register.hbs',{fourwheeler: four, twowheeler: "", whichPartial : function () {
			return step;
		}
		});
	}
}catch (e) {
		console.log(e);
		res.redirect('/error');
}
});

app.get('/register/three', authenticate, stpchk, (req, res)=>{

var two = [], four=[], rsa="";
	if (req.sp.rsa === true) {
		rsa += '    <div class="model">                 <h3>Road side Assistance Prices (RSA)</h3>                 <div class="services">                   <h4>Toeing SUV</h4>                   <div class="avgPrice">                     0                   </div>                   <div class="form-group">                     <input data-inp="number" name="toeing_suv" type="text"><i class="bar"></i>                   </div>                 </div>                      <div class="services">                   <h4>Toeing hatchback</h4>                   <div class="avgPrice">                     0                   </div>                   <div class="form-group">                     <input data-inp="number" name="toeing_hatchback" type="text"><i class="bar"></i>                   </div>                 </div>               <div class="services">                   <h4>Toeing Sedan</h4>                   <div class="avgPrice">                     0                   </div>                   <div class="form-group">                     <input data-inp="number" name="toeing_sedan" type="text"><i class="bar"></i>                   </div>                 </div>               <div class="services">                   <h4>Toeing crossover</h4>                   <div class="avgPrice">                     0                   </div>                   <div class="form-group">                     <input data-inp="number" name="toeing_crossover" type="text"><i class="bar"></i>                   </div>                 </div>               <div class="services">                   <h4>Toeing mini SUV</h4>                   <div class="avgPrice">                     0                   </div>                   <div class="form-group">                     <input data-inp="number" name="toeing_miniSuv" type="text"><i class="bar"></i>                   </div>                 </div>               <div class="services">                   <h4>Battery Jump Start</h4>                   <div class="avgPrice">                     0                   </div>                   <div class="form-group">                     <input data-inp="number" name="batteryJumpStart" type="text"><i class="bar"></i>                   </div>                 </div>                 <div class="services">                     <h4>Flat Tire</h4>                     <div class="avgPrice">                       0                     </div>                     <div class="form-group">                       <input data-inp="number" name="flatTire" type="text"><i class="bar"></i>                     </div>                   </div>                   <div class="services">                       <h4>Fuel Fill</h4>                       <div class="avgPrice">                         0                       </div>                       <div class="form-group">                         <input data-inp="number" name="fuelProblem" type="text"><i class="bar"></i>                       </div>                     </div>                             <div class="services">                         <h4>Minor Repair</h4>                         <div class="avgPrice">                           0                         </div>                         <div class="form-group">                           <input data-inp="number" name="minorRepair" type="text"><i class="bar"></i>                         </div>                       </div>                       <div class="services">                           <h4>Medical Assistance</h4>                           <div class="avgPrice">                             0                           </div>                           <div class="form-group">                             <input data-inp="number" name="medical" type="text"><i class="bar"></i>                           </div>                         </div>     </div> ';
	}

  for (var i = 0; i < req.sp.vehicles.length; i++) {
    var arr = _.split(req.sp.vehicles[i].name, '_');
    if (_.last(arr) === "two") {
      two.push(arr);
    }
    else if (_.last(arr) === "four") {
      four.push(arr);
    }
  }

  res.render('service/register.hbs',{rsa: rsa, Four: four, Two: two, error: false, whichPartial : function () {
    return "three";
  }
  });
});

app.post('/register/three', authenticate, stpchk, (req, res)=> {
  var veh =  req.sp.vehicles;
  var dataall = [];

  for (var key in req.body) {
    var data = _.split(key, /_(.+)/);
    for (var i = 0; i < veh.length; i++) {
      if (veh[i].name === data[1]) {
        veh[i][data[0]] = req.body[key];
      }
    }
		for (var rsa in req.sp) {
			if (req.sp[rsa] == key) {
				// req.sp[rsa] = req.body[key];
				console.log(key);
			}
		}
  }

  req.sp.stepthree = true;
  req.sp.save().then(() => {
    res.redirect('/');
  }).catch((e) => {
      res.render('service/register.hbs',{Four: four, Two: two, error: true, whichPartial : function () {
        return "three";
      }
    });
  });
});

app.post('/otp', async (req, res)=> {
  var otp = Math.floor(10000 + Math.random() * 90000);
  var body = {
    'createdAt': new Date(),
    'otp': otp,
    'contactNumber': req.body.mob,
  };
try {
	var spmob = await ServiceProvider.find({'contact': req.body.mob});
	var email = await ServiceProvider.find({'email': req.body.email});
	var adhaar = await ServiceProvider.find({'adhaar': req.body.adhaar});

	if (spmob.length !== 0) {
		res.status(500).send("Mobile Number already registered");
	}
	else if (email.length !== 0) {
		res.status(500).send("Email ID already registered");
	}
	else if (adhaar.length !== 0) {
		res.status(500).send("Adhaar number already registered");
	}
	else {
		var number = encodeURIComponent(body.contactNumber);
		var sender = encodeURIComponent("AUTOKI");
		var message = encodeURIComponent("Thanks for signing up at autoking.in. Please enter "+otp+" for completing the registration process. This OTP is valid for 15 minutes.");

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
	}
} catch (e) {
	console.log(e);
	res.redirect('/error');
}
});

app.post('/register/one', (req, res) => {
 	adhaarupload(req, res, (err) => {
 		if (err) {
			res.status(400).render('service/register.hbs',{error: "window.alert('File not supported or too big. Upload limit 5MB, files allowed: jpeg, jpg, png, pdf');", whichPartial : function () {
				return "one";
				}
			});
			console.log(err);
			return;
 		}
		var data = req.body;
		var two = (data.twowheeler === "1") ? true:false;
		var four = (data.fourwheeler === "1") ? true:false;
		var pnd = (data.pickndrop === "1") ? true:false;

		var validateErr = "";

		var body = {
			name: data.name,
			address: data.address,
			twowheeler: two,
			fourwheeler: four,
			password: data.password,
			pickndrop: pnd,
			lat: data.lat,
			lng: data.lng,
			owner: data.scname,
			email: data.email,
			contact: data.mno,
			rsa: data.rsa,
			adhaarpic: req.file.path,
			adhaar: data.adhaar,
			otp: data.otp,
			contactVerified: true,
			stepone: true
		};

		Otp.count({$and: [{"contactNumber": data.mno},{ "otp": data.otp}]}).then((otp)=> {
			if (otp) {
				var sp = new ServiceProvider(body);
				sp.save().then(() => {
					return sp.generateAuthToken();
				}).then((token) => {
					res.header('x-auth', token).cookie('xauth', token, {httpOnly: true, maxAge: 2592000000, sameSite: true}).redirect('/register/two');
				}).catch((e) => {
					console.log(e);
					res.status(400).send("Please fill in all the fields");
				});
			}
			else {
				res.status(404).render('service/register.hbs',{error: "window.alert('Wrong OTP entered, try again!');", whichPartial : function () {
					return "one";
				}
			});
		}
	}).catch((e) => {
		console.log(e);
		res.status(500).redirect('/error');
	});
 	});
});

app.post('/register/two', authenticate, stpchk, (req, res) => {
  for (var i = 0; i < req.body.vehicles.length; i++) {
    req.sp.vehicles.push({"name": req.body.vehicles[i]});
  }
  req.sp.steptwo = true,
  req.sp.save().then(() => {
    res.redirect('/register/three');
  }).catch((e) => {
    res.status(404).send(e);
  });
});

app.post('/vacation', authenticate, (req, res) => {
  if(req.body.vac === true){
    req.sp.vacation = true;
  }
  else if (req.body.vac === false) {
    req.sp.vacation = false;
  }
  else {
    res.status(400).send();
		console.log(req.body);
  }
  req.sp.save().then((e) => {
    res.status(200).send()
  }).catch((e) => {
    res.status(400).send(e)
		console.log(e);
  });
})

app.post('/slots', authenticate, (req, res) => {
	var data = {
		"serviceProvider": req.sp._id,
		"slotStart": req.body.start,
		"slotEnd": req.body.end
	}
	var slot = new Slot(data);
	slot.save().then(()=> {
		res.status(200).send();
	}).catch((e) => {
		res.status(400).send(e);
	});
});

app.get('/error', (req, res) => {
  res.status(404).send("Error Occured");
});

app.post('/model', (req, res) => {
  var body = _.pick(req.body, ['brand','name','petrol', 'petrolauto','diesel','dieselauto','hybrid','electric']);
  fourWheeler.findOne({'brand': body.brand}, function (err, car) {
    if (err) return console.log(err);
    car.models.push(body);

    car.save().then(() => {
      res.status(200).send(car);
    }).catch((e) => {
      res.status(400).send(e);
    });
  });
});

app.post('/brand', (req, res) =>{
  var body = _.pick(req.body, ["brand"]);
  var data = new fourWheeler(body);
  data.save().then(() => {
    res.status(200).send();
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.post('/two', (req, res)=> {
  var body = _.pick(req.body, ["brand"]);
  var data = new twoWheeler(body);
  data.save().then(() => {
    res.status(200).send();
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.post('/twom', (req, res) => {
  var body = _.pick(req.body, ['brand','name','automatic','electric']);
  twoWheeler.findOne({'brand': body.brand}, function (err, car) {
    if (err) return console.log(err);
    car.models.push(body);

    car.save().then(() => {
      res.status(200).send(car);
    }).catch((e) => {
      res.status(400).send(e);
    });
  });
});


app.get('/', authenticate, async (req, res) => {

	try {
		const slots = await Slot.find({'serviceProvider': req.sp._id});
		var slothtml = '<div class="prevSlots">';
		var range = [
			'9:00 AM','10:00 AM','11:00 AM',
			'12:00 PM','1:00 PM','2:00 PM','3:00 PM',
			'4:00 PM','5:00 PM','6:00 PM','7:00 PM',
			'8:00 PM','9:00 PM'
		];
		for(var i = 0; i < slots.length; i++){
			slothtml += '<div class="card"><div class="time">'+range[slots[i].slotStart]+' - '+ range[slots[i].slotEnd]+'</div><div class="del"><i class="fa fa-fw fa-lg delicon fa-trash"></i></div></div>';
		};
		slothtml += '</div>';

		const boostReq = await BoostReq.find({'serviceProvider': req.sp._id});
		var boostreq = "";
		for (var i = 0; i < boostReq.length; i++) {
			boostreq += `<tr><td>${boostReq[i].date}</td><td>${boostReq[i].message}</td><td>${boostReq[i].pack}</td><td>${boostReq[i].approved}</td></tr>`;
		}
		const openBookings = await Booking.find({'serviceProvider': req.sp._id, 'bookingComplete': false});
		const closedBookings = await Booking.find({'serviceProvider': req.sp._id, 'bookingComplete': true});
		if (openBookings.length === 0) {
			var open = "No Open Bookings";
		}
		else {
			var open = "";
			for (var i = 0; i < openBookings.length; i++) {
				var date = new Date(openBookings[i].date);
				var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
				var range = [
				  '9:00 AM','10:00 AM','11:00 AM',
				  '12:00 PM','1:00 PM','2:00 PM','3:00 PM',
				  '4:00 PM','5:00 PM','6:00 PM','7:00 PM',
				  '8:00 PM','9:00 PM'
				];
			 	open += '<a href="/'+openBookings[i].bookId +'"><div class="bookCard"><div class="bookingId">'+ openBookings[i].bookId +'</div><div class="bookingDateAndTime">'+ date.getDate() + '/'+months[date.getMonth()]+ ' ' + range[openBookings[i].slot[0]] +'-'+ range[openBookings[i].slot[1]] +'</div></div></a>';
			}
		}
		if (closedBookings.length === 0) {
			var closed = "No Closed Bookings";
		}
		else {
			var closed = "";
			for (var i = 0; i < closedBookings.length; i++) {
				var date = new Date(closedBookings[i].date);
				var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
				var range = [
					'9:00 AM','10:00 AM','11:00 AM',
					'12:00 PM','1:00 PM','2:00 PM','3:00 PM',
					'4:00 PM','5:00 PM','6:00 PM','7:00 PM',
					'8:00 PM','9:00 PM'
				];
				closed += '<a href="/'+closedBookings[i].bookId +'"><div class="bookCard"><div class="bookingId">'+ closedBookings[i].bookId +'</div><div class="bookingDateAndTime">'+ date.getDate() + '/'+months[date.getMonth()]+ ' ' + range[closedBookings[i].slot[0]] +'-'+ range[closedBookings[i].slot[1]] +'</div></div></a>';
			}
		}

		const Notifications = await Notify.find({'serviceProvider': req.sp._id});
		const Tips = await Tip.find();
		const revData = await Ratnrev.find({'serviceProvider': req.sp._id});
		var rev = [];

		// find the rating and get avg
		var rat = 0.00;

		var approved = "";
		if (req.sp.approved === false) {
			approved = '<div class="warn">Account has not been verified. Please wait till the account is verified by us.</div>';
		}
		res.render('service/dash.hbs', {open: open, closed: closed, rating: rat, name: req.sp.name, approved: approved, slots: slothtml, rev: rev, boostreq: boostreq});
	} catch (e) {
		console.log(e);
	}
});

app.get('/slotDel', authenticate, (req, res) => {
	 var data = Slot.find({'serviceProvider': req.sp._id}).exec(callback);
	 console.log(data);
	 res.send();
});

app.post('/boost', authenticate, (req, res) =>{
	var data = {
		"serviceProvider": req.sp._id,
		"pack": req.body.pack,
		"message": req.body.message,
	}
	var boost = new BoostReq(data);
	boost.save().then(()=>{
		res.status(200).send();
	}).catch((e) => {
		res.status(400).send();
	});
});

app.post('/prefer', authenticate, (req, res) => {

});

app.post('/profilepic', authenticate, (req, res) => {

});

app.get('/logout', authenticate, (req, res) => {
  req.sp.removeToken(req.token).then(() => {
    res.clearCookie('xauth');
    res.status(200).redirect('/');
  }, () => {
    res.status(400).redirect('/');
  });
});

app.get('/:booking', authenticate, stpchk, async (req, res) => {

	var id = req.params.booking;
	try {
		var booking = await Booking.findOne({$and: [{"bookId": id},{"serviceProvider": req.sp._id}]});
			var confirmOtp = '<form method="post"><input type="text" name="name" placeholder="Name"><input type="text" name="contact" placeholder="Contact Number"><input type="text" name="pickupTime" placeholder="Expected Pickup Time"><input type="submit" value="Submit"> </form>';
		var veh = booking.vehicle.replace(/_/g, " ");
		var customer = await User.findOne({'_id': booking.customer});
		var veh = booking.vehicle.replace(/_/g, " ");
		var services = ["General Service", "Oil Change", "Complete Breakdown", "Clutch and Brakes Issue", "Electrical Issue", "Filter change", "Re-Painting/Scratch Removal", "Tyre Puncture/Replacement", "Parts Change", "Other"];
		var range = [
			'9:00 AM','10:00 AM','11:00 AM',
			'12:00 PM','1:00 PM','2:00 PM','3:00 PM',
			'4:00 PM','5:00 PM','6:00 PM','7:00 PM',
			'8:00 PM','9:00 PM'
		];
		var time = range[booking.slot[0]] + "-" + range[booking.slot[1]];
		var reqServices = "";
		for (var i = 0; i < booking.services.length; i++) {
				reqServices += '<li>'+ services[booking.services[i]-1] +'</li>';
		}
		if (booking.pnd) {
			var pnd = "<h2>Pickup Address</h2><p>" + booking.pndAddress + '</p><div class="pickndrop"><h2>Pick and Drop</h2>' + confirmOtp + '</div>';
		}
		else {
			var pnd = "";
		}
		res.render('service/booking.hbs', {time: time,pnd: pnd, id: req.params.booking, service: reqServices, veh: veh, customer: customer.name,fuel: booking.fuel});
	} catch (e) {
		console.log(e);
		res.redirect('/error');
	}

});

module.exports = app;
// app.listen(4000, 'localhost', () => {
//   console.log('Server started at port 2000 successfully');
// });
app.listen(5000, '172.31.17.223', () => {
  console.log("Server started at port 5000 successfully");
});
