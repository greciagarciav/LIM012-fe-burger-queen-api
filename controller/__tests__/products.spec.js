const mongoose = require('mongoose');
const { MockMongoose } = require('mock-mongoose');

const mockMongoose = new MockMongoose(mongoose);
const {
  getProducts,
  getOneProduct,
  addProduct,
  deleteProduct,
  updateProduct,
} = require('../../controller/products');
const { connectToDB } = require('../../database/db-connect');
const Product = require('../../database/product-schema');

describe('Products', () => {
  beforeAll((done) => {
    mockMongoose.prepareStorage().then(() => {
      connectToDB('mongodb://127.0.0.1/BurguerQueen').then(() => {
        done();
      });
    });
  });
  afterAll(async (done) => {
    await mockMongoose.helper.reset();
    await mockMongoose.killMongo();
    done();
  });
});
