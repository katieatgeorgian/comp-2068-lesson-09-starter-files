module.exports = router => {
  require('./routes/users')(router);
  return router;
};