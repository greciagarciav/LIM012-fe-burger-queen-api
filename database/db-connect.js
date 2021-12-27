/* eslint-disable no-console */
const mongoose = require('mongoose');

exports.connectToDB = async (url) => {
  try {
    await mongoose.connect(url, {
      useUnifiedTopology: true,
      useCreateIndex: true,
      useNewUrlParser: true,
    });
    console.log('db connected!', url);
  } catch (err) {
    console.log(err.message);
  }
};
