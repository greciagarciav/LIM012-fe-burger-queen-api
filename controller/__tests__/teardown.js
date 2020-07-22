const mongoose = require('mongoose');

module.exports = async () => {
  await global.__MONGOD__.stop();
  await mongoose.connection.close();
};
