var {ServiceProvider} = require('./../models/serviceProvider');

var stpchk = (req, res, next)=> {
  var token = req.cookies.xauth;
  if(!token){
    token = req.header('x-auth');
  }

  ServiceProvider.findByToken(token).then((sp) => {
    if(sp.steptwo == false){
      if (req.path != '/register/two') {
        res.redirect('/register/two');
      }
      else {
        next();
      }
    }
    else if (sp.stepthree == false) {
      if (req.path != '/register/three') {
        res.redirect('/register/three');
      }
      else {
        next();
      }
    }
    else {
      next();
    }
  }).catch((e) => {
    res.status(401).redirect('/login');
  });
};

module.exports = {stpchk}
