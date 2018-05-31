var {Admin} = require('./../models/admin');

var authenticate = (req, res, next) => {
  var token = req.cookies.xauth;
  if(!token){
    token = req.header('x-auth');
  }

  Admin.findByToken(token).then((admin) => {
    if (!admin) {
      return Promise.reject();
    }

    req.admin = admin;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(401).redirect('/login');
  });
};

module.exports = {authenticate};
