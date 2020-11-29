module.exports = router => {
  require('./routes/users')(router);
  require('./routes/sessions')(router);
  return router;
};