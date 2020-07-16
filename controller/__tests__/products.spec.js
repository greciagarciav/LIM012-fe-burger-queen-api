/* eslint-disable no-console */
const mongoose = require('mongoose');
const { MockMongoose } = require('mock-mongoose');

jest.setTimeout(50000);

const mockMongoose = new MockMongoose(mongoose);
const {
  getProducts,
  getOneProduct,
  addProduct,
  deleteProduct,
  updateProduct,
} = require('../../controller/products');
const { connectToDB } = require('../../database/db-connect');

const resp = {
  json: (obj) => obj,
  status(responseStatus) {
    this.statusCode = responseStatus;
    return this;
  },
};
const next = (number) => number;
describe('Products', () => {
  // beforeAll((done) => {
  //   mockMongoose.prepareStorage().then(() => {
  //     connectToDB('mongodb://127.0.0.1/BurguerQueen');
  //     mongoose.connection.on('connected', async () => {
  //       console.log('db connection is now open');
  //       done();
  //     });
  //   });
  // });
  it('should add a product, get it and updated it', async () => {
    const req = {
      body: {
        name: 'tacos',
        price: 3,
        dateEntry: Date.now(),
      },
    };
    const result = await addProduct(req, resp, next);
    if (result) {
      const req2 = {
        params: {
          productId: result._doc._id,
        },
        body: {
          price: 12,
        },
      };
      delete result._doc._id;
      delete result._doc.__v;
      const product = await getOneProduct(req2, resp, next);
      const productUpdated = await updateProduct(req2, resp, next);
      expect(result).toBe(req.body);
      expect(product.name).toBe('tacos');
      expect(product.price).toBe(3);
      expect(productUpdated.price).toBe(12);
    }
  });
  it('should not add a product when the price is not defined', async () => {
    const req = {
      body: {
        name: 'tacos',
      },
    };
    const result = await addProduct(req, resp, next);
    expect(result).toBe(400);
  });
  it('should not add a product when the name is not defined', async () => {
    const req = {
      body: {
        price: 5,
      },
    };
    const result = await addProduct(req, resp, next);
    expect(result).toBe(400);
  });
  it('should not add a product when the price is not a number', async () => {
    const req = {
      body: {
        price: 'five',
      },
    };
    const result = await addProduct(req, resp, next);
    expect(result).toBe(400);
  });
  it('should not get a product when it does not exists', (done) => {
    const req = {
      params: {
        productId: 'error',
      },
    };
    getOneProduct(req, resp, (num) => {
      expect(num).toBe(404);
      done();
    });
  });
  it('should add a product and be available to delete it', async () => {
    const req = {
      body: {
        name: 'pizza',
        price: 5,
        dateEntry: Date.now(),
      },
    };
    const result = await addProduct(req, resp, next);
    if (result) {
      const req2 = {
        params: {
          productId: result._doc._id,
        },
      };
      delete result._doc._id;
      delete result._doc.__v;
      const product = await deleteProduct(req2, resp, next);
      expect(result).toBe(req.body);
      expect(product.name).toBe('pizza');
      if (product) {
        const productDeleted = await getOneProduct(req2, resp, next);
        expect(productDeleted).toBe(404);
      }
    }
  });
  it('should get all the products', async () => {
    const req = {
      query: {
        page: 1,
        limit: 2,
      },
    };
    const result = await getProducts(req, resp, next);
    console.log(result);
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('tacos');
    expect(result[0].price).toBe(3);
  });
  // afterAll(async (done) => {
  //   await mockMongoose.helper.reset();
  //   await mockMongoose.killMongo();
  //   done();
  // });
});
