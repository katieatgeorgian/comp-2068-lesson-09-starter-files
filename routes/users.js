const { index, show, create, update, destroy } = require('../controllers/users');

module.exports = (router) => {
  router.get('/users', index);
  router.get('/users/:id', show);
  router.post('/users', create);
  router.post('/users/update', update);
  router.post('/users/destroy', destroy);
  return router;
};