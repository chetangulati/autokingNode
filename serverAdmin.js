const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const _ = require('lodash');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const request = require('request');
const fs = require('fs');

const {mongoose} = require('./db/mongoose');
const {Admin} = require('./models/admin');
const {ServiceProvider} = require('./models/serviceProvider');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticateAdmin');
const {fourWheeler} = require('./models/fourwheeler');
const {twoWheeler} = require('./models/twowheeler');

var app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(express.static(__dirname + '/static'));
app.use('/' ,express.static(__dirname + '/views/admin'));
app.set('view engine', 'hbs');

app.get('/', authenticate, async (req, res) => {
  try {
    const regData = await ServiceProvider.find({'approved': false, 'docsVerified': false});
    var reg = "";
    for (var i = 0; i < regData.length; i++) {
      reg +=  `<tr><td><a href="/sp/${regData[i]._id}">${regData[i].name}</a></td><td>${regData[i].owner}</td><td>${regData[i].address}</td><td><a href="/doc/${regData[i]._id}">view</a></td><td><a href="https://maps.google.com/maps/place/?api=1&lat=${regData[i].lat}&lng=${regData[i].lng}" target="_blank">location</a></td><td><button type="button" data-sp="${regData[i]._id}" class="btn btn-success approve">Approve</button></td></tr>`;
    }
    const appData = await ServiceProvider.find({'approved': true, 'docsVerified': true});
    var approved = "";
    for (var i = 0; i < appData.length; i++) {
      approved +=  `<tr><td><a href="/sp/${appData[i]._id}">${appData[i].name}</a></td><td>${appData[i].owner}</td><td>${appData[i].address}</td><td><a href="/doc/${appData[i]._id}">view</a></td><td><a href="https://maps.google.com/maps/place/?api=1&lat=${appData[i].lat}&lng=${appData[i].lng}" target="_blank">location</a></td><td><button type="button" data-sp="${appData[i]._id}" class="btn btn-danger disapprove">Disapprove</button></td></tr>`;
    };
    const twoWheelerData = await twoWheeler.find();
    var two = "";
    for (var i = 0; i < twoWheelerData.length; i++) {
      for (var j = 0; j < twoWheelerData[i].models.length; j++) {
        two += `<tr><td>2 - wheeler</td><td>${twoWheelerData[i].brand}</td><td>${twoWheelerData[i].models[j].name}</td><td>Nil</td></tr>`;
      }
    };
    const fourWheelerData = await fourWheeler.find();
    var four = "";
    for (var i = 0; i < fourWheelerData.length; i++) {
      for (var j = 0; j < fourWheelerData[i].models.length; j++) {
        four += `<tr><td>4 - wheeler</td><td>${fourWheelerData[i].brand}</td><td>${fourWheelerData[i].models[j].name}</td><td>${fourWheelerData[i].models[j].cartype}</td></tr>`;
      }
    };
    res.render('admin/index.hbs', {reg: reg, approved: approved, two: two, four: four});
  } catch (e) {
    res.redirect('/error');
  }
});

app.get('/doc/:sp', authenticate, async (req, res) => {
  var sp = req.params.sp;
  try {
    const doc = await ServiceProvider.findOne({'_id': sp}, 'adhaarpic');

    res.download(__dirname+'/'+doc.adhaarpic);
  } catch (e) {
    console.log(e);
    res.redirect('/error');
  }
});

app.get('/sp/:sp', authenticate, async (req, res)=>{
  var sp = req.params.sp;
  try {
    const data = await ServiceProvider.findOne({'_id': sp});
    res.send(data)
  }
  catch(e){
    console.log(e);
    res.redirect('/error');
  }
});

app.get('/login', (req, res) => {
  res.render('admin/login.hbs');
});

app.post('/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  Admin.findByCredentials(body.email, body.password).then((user) => {
      return user.generateAuthToken().then((token) => {
        res.header('x-auth', token).cookie('xauth', token, {httpOnly: true, maxAge: 2592000000, sameSite: true}).redirect('/');
      });
    }).catch((e) => {
      res.status(401).send("error: " + e);
    });
});

app.post('/approve', authenticate, async (req, res) =>{
  try {
    await ServiceProvider.update({'_id': req.body.sp}, {$set: {approved: true, docsVerified: true}});
    const appData = await ServiceProvider.find({'approved': true, 'docsVerified': true});
    var approved = "";
    for (var i = 0; i < appData.length; i++) {
      approved +=  `<tr><td><a href="/sp/${appData[i]._id}">${appData[i].name}</a></td><td>${appData[i].owner}</td><td>${appData[i].address}</td><td><a href="/doc/${appData[i]._id}">view</a></td><td><a href="https://maps.google.com/maps/place/?api=1&lat=${appData[i].lat}&lng=${appData[i].lng}" target="_blank">location</a></td><td><button type="button" data-sp="${appData[i]._id}" class="btn btn-danger disapprove">Disapprove</button></td></tr>`;
    };
    if(approved === "") approved = '<td colspan="6" class="dataTables_empty" valign="top">No data available in table</td>';

    const regData = await ServiceProvider.find({'approved': false, 'docsVerified': false});
    var reg = "";
    for (var i = 0; i < regData.length; i++) {
      reg +=  `<tr><td><a href="/sp/${regData[i]._id}">${regData[i].name}</a></td><td>${regData[i].owner}</td><td>${regData[i].address}</td><td><a href="/doc/${regData[i]._id}">view</a></td><td><a href="https://maps.google.com/maps/place/?api=1&lat=${regData[i].lat}&lng=${regData[i].lng}" target="_blank">location</a></td><td><button type="button" data-sp="${regData[i]._id}" class="btn btn-success approve">Approve</button></td></tr>`;
    };
    if(reg === "") reg = '<td colspan="6" class="dataTables_empty" valign="top">No data available in table</td>';
    var data = {
      reg: reg,
      app: approved,
    }
    res.status(200).send(data);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.post('/disapprove', authenticate, async (req, res) => {
  try {
    await ServiceProvider.update({'_id': req.body.sp}, {$set: {approved: false, docsVerified: false}});
    const regData = await ServiceProvider.find({'approved': false, 'docsVerified': false});
    var reg = "";
    for (var i = 0; i < regData.length; i++) {
      reg +=  `<tr><td><a href="/sp/${regData[i]._id}">${regData[i].name}</a></td><td>${regData[i].owner}</td><td>${regData[i].address}</td><td><a href="/doc/${regData[i]._id}">view</a></td><td><a href="https://maps.google.com/maps/place/?api=1&lat=${regData[i].lat}&lng=${regData[i].lng}" target="_blank">location</a></td><td><button type="button" data-sp="${regData[i]._id}" class="btn btn-success approve">Approve</button></td></tr>`;
    };
    if(reg === "") reg = '<td colspan="6" class="dataTables_empty" valign="top">No data available in table</td>';

    const appData = await ServiceProvider.find({'approved': true, 'docsVerified': true});
    var approved = "";
    for (var i = 0; i < appData.length; i++) {
      approved +=  `<tr><td><a href="/sp/${appData[i]._id}">${appData[i].name}</a></td><td>${appData[i].owner}</td><td>${appData[i].address}</td><td><a href="/doc/${appData[i]._id}">view</a></td><td><a href="https://maps.google.com/maps/place/?api=1&lat=${appData[i].lat}&lng=${appData[i].lng}" target="_blank">location</a></td><td><button type="button" data-sp="${appData[i]._id}" class="btn btn-danger disapprove">Disapprove</button></td></tr>`;
    };
    if(approved === "") approved = '<td colspan="6" class="dataTables_empty" valign="top">No data available in table</td>';
    var data = {
      reg: reg,
      app: approved,
    }
    res.status(200).send(data);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.post('/addBrand', authenticate, (req, res) =>{
  if (req.body.vehicleType == "2") {
    var body = _.pick(req.body, ["brand"]);
    var data = new twoWheeler(body);
    data.save().then(() => {
      res.status(200).send();
    }).catch((e) => {
      res.status(400).send(e);
    });
  }
  else if (req.body.vehicleType == "4") {
    var body = _.pick(req.body, ["brand"]);
    var data = new fourWheeler(body);
    data.save().then(() => {
      res.status(200).send();
    }).catch((e) => {
      res.status(400).send(e);
    });
  }
});

app.get('/brand', authenticate, (req, res) => {
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
  else {
    res.status(400).send("Some error occoured");
  }
});

app.post('/addModel', authenticate, (req, res) => {
  if (req.body.vehicleType == "2") {
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
  }
  else if (req.body.vehicleType == "4"){
    var body = _.pick(req.body, ['brand','name', 'cartype', 'cng','diesel', 'petrol','dieselauto', 'petrolauto', 'electric', 'hybrid']);
    fourWheeler.findOne({'brand': body.brand}, function (err, car) {
      if (err) return console.log(err);
      car.models.push(body);
      car.save().then(() => {
        res.status(200).send(car);
      }).catch((e) => {
        res.status(400).send(e);
      });
    });
  }
});

app.post('/register', (req,res) => {
  var body = _.pick(req.body, ['email', 'password','contact']);
  var user = new Admin(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).cookie('xauth', token, {httpOnly: true, maxAge: 2592000000, sameSite: true}).redirect('/');
  }).catch((e) => {
    res.status(400).send(e);
  })
});

module.exports = app;
app.listen(4000, 'localhost', () => {
  console.log('Server started at port 2000 successfully');
});
// app.listen(4000, '172.31.17.223', () => {
//   console.log('Server started at port 2000 successfully');
// });
