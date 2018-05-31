var {User} = require('./../models/user');

var authenticate = (req, res, next) => {
  var token = req.cookies.xauth;
  if(!token){
    token = req.header('x-auth');
  }

  User.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    req.user = user;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(401).redirect('/login?next='+encodeURIComponent(req.originalUrl));
  });
};

var check = (req, res, next) => {
  var token = req.cookies.xauth;

  User.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    req.user = user;
    req.token = token;
    next();
  }).catch((e) => {
    req.user = false;
    next();
  });
}

module.exports = {authenticate, check};
