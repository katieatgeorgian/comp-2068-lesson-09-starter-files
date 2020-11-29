const { index, show, create, update, destroy } = require('../controllers/users');
const passport = require('passport');

module.exports = (router) => {
  router.get('/users', index);
  router.get('/users/:id', show);
  router.post('/users', create);
  //authenticate users' token - if token fails rejected; if token passes, return user and calls update or destroy
  router.post('/users/update', passport.authenticate('jwt', { session: false }), update);
  router.post('/users/destroy', passport.authenticate('jwt', { session: false }), destroy);
  return router;
};