const getAuth = require('../controller/auth');

module.exports = (app, nextMain) => {
  app.post('/auth', getAuth);
  return nextMain();
};
