// eslint-disable-next-line import/no-extraneous-dependencies
const mongoSetup = require('@shelf/jest-mongodb/setup');
const { connectToDB } = require('../../database/db-connect');

module.exports = async () => {
  await mongoSetup();
  await connectToDB(process.env.MONGO_URL);
};
