const passport = require('passport');
const jwt = require('jsonwebtoken');

//assuming in req body that they have an email and password field (from model)
exports.authenticate = (req, res, next) => {
  //strategy want to use to authenticate, which is local strategy
  passport.authenticate('local', (error, user) => {
    if (error || !user) return next(error);//you're not authenticated so can't do things
    //give it user want to login in
    req.login(user, { session: false }, async err => {
      if (err) return next(err);
      
      const body = { _id: user._id, email: user.email };
      //generate token
      const token = jwt.sign({ user: body}, 'any salty secret here');

      return res.status(200).json({ token });
    });
  }) (req, res, next);
};
