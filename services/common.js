const passport = require('passport');
exports.isAuth = (req, res, done) =>{
    return passport.authenticate('jwt');
  }

  exports.sanitizeUser = (user) => {
    return{id: user.id, role: user.role}
  }

  exports.cookieExtractor = function (req) {
    var token = null;
    if (req && req.cookies) {
      token = req.cookies["jwt"];
      token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MTJhN2Q4YzdiMjA4OWQyNDZlMTc5NCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjk1NzMxODE0fQ._DJ3kjJQdmkh1ZMxeJK3QGDGGJrTMA61iDVcjlB73xI"
    }
    return token;
  };