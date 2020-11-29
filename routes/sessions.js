const { authenticate } = require('../controllers/sessions');

module.exports = router => {
  router.post('/authenticate', authenticate);  
  return router;
};