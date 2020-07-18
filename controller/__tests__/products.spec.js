/* eslint-disable no-param-reassign */
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
  setHeader: (name, value) => {
    this[name] = value;
  },
};
const next = (number) => number;
const standardReq = {
  query: {
    page: 1,
    limit: 1,
  },
};
const productReq = {
  body: {
    name: 'milkshake',
    price: 9,
    dateEntry: Date.now(),
  },
};
describe('Products', () => {
  beforeAll((done) => {
    mockMongoose.prepareStorage().then(() => {
      connectToDB('mongodb://127.0.0.1/BurguerQueen');
      mongoose.connection.on('connected', async () => {
        await addProduct(productReq, resp, next);
        done();
      });
    });
  });
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
      expect(result).toBe(req.body);
      expect(product.name).toBe('tacos');
      expect(product.price).toBe(3);
      const productUpdated = await updateProduct(req2, resp, next);
      expect(productUpdated.price).toBe(12);
    }
  });
  it('should not add a product when the price is not defined', async () => {
    const req = {
      body: {
        name: 'extra-cheese',
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
  it('should not add a product when the price is not a number', (done) => {
    const req = {
      body: {
        name: 'soda',
        price: 'five',
      },
    };
    addProduct(req, resp, (num) => {
      expect(num).toBe(400);
      done();
    });
  });
  it('should not get, delete and update a product when it does not exists', (done) => {
    const req = {
      params: {
        productId: 'error',
      },
      body: {
        name: 'test',
      },
    };
    getOneProduct(req, resp, (num) => {
      expect(num).toBe(404);
      done();
    });
    deleteProduct(req, resp, (num) => {
      expect(num).toBe(404);
      done();
    });
    updateProduct(req, resp, (num) => {
      expect(num).toBe(404);
      done();
    });
  });
  it('should get all the products', async () => {
    const result = await getProducts(standardReq, resp, next);
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('milkshake');
    expect(result[0].price).toBe(9);
  });
  it('should update a product when the values given are ok and reject the request when not', async () => {
    const products = await getProducts(standardReq, resp, next);
    const ids = products.map((item) => item._id);
    const req = {
      params: {
        productId: ids[0],
      },
      body: {
        name: 'bacon',
      },
    };
    const wrongPriceReq = {
      params: {
        productId: ids[0],
      },
      body: {
        price: 'twenty',
      },
    };
    const wrongDateReq = {
      params: {
        productId: ids[0],
      },
      body: {
        dateEntry: 'today',
      },
    };
    const wrongIdReq = {
      params: {
        productId: 'wrong-id',
      },
      body: {
        price: 20,
      },
    };
    const result = await updateProduct(req, resp, next);
    const result2 = await updateProduct(wrongPriceReq, resp, next);
    const result3 = await updateProduct(wrongIdReq, resp, next);
    const result4 = await updateProduct(wrongDateReq, resp, next);
    expect(result.name).toBe('bacon');
    expect(result2).toBe(400);
    expect(result3).toBe(404);
    expect(result4).toBe(400);
  });
  it('should not update a product when the body is empty', (done) => {
    const req = {
      body: {},
    };
    updateProduct(req, resp, (num) => {
      expect(num).toBe(400);
      done();
    });
  });
  it('should not update or delete a product when ObjectId is wrong', (done) => {
    const req = {
      params: {
        productId: '5f0f8080ab0857cd368ab972',
      },
      body: {
        price: 16,
      },
    };
    updateProduct(req, resp, (num) => {
      expect(num).toBe(404);
      done();
    });
    deleteProduct(req, resp, (num) => {
      expect(num).toBe(404);
      done();
    });
  });
  it('should delete a product', async (done) => {
    const products = await getProducts(standardReq, resp, next);
    const ids = products.map((item) => item._id);
    const req2 = {
      params: {
        productId: ids[0],
      },
    };
    const result = await deleteProduct(req2, resp, next);
    expect(result._doc).toEqual(products[0]._doc);
    getOneProduct(req2, resp, (num) => {
      expect(num).toBe(404);
      done();
    });
  });
  afterAll(async () => {
    await mockMongoose.helper.reset();
    await mockMongoose.killMongo();
  });
});
