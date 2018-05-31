var {ServiceProvider} = require('./../models/serviceProvider');

var authenticate = (req, res, next) => {
  var token = req.cookies.xauth;
  if(!token){
    token = req.header('x-auth');
  }

  ServiceProvider.findByToken(token).then((sp) => {
    if (!sp) {
      return Promise.reject();
    }

    req.sp = sp;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(401).redirect('/login');
  });
};

module.exports = {authenticate};
