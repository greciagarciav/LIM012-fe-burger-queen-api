const mongoose = require('mongoose');
const {
  getProducts,
  getOneProduct,
  addProduct,
  deleteProduct,
  updateProduct,
} = require('../products');
const { resp, next } = require('./mock-express');
const { connectToDB } = require('../../database/db-connect');

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
    connectToDB(process.env.MONGO_URL);
    mongoose.connection.on('connected', async () => {
      await addProduct(productReq, resp, next);
      done();
    });
  });
  it('should add a product', async () => {
    const req = {
      body: {
        name: 'tacos',
        price: 3,
        dateEntry: Date.now(),
      },
    };
    const result = await addProduct(req, resp, next);
    expect(result.name).toBe('tacos');
    expect(result.price).toBe(3);
    req.params = {
      productId: result._id,
    };
    const product = await getOneProduct(req, resp, next);
    expect(product.name).toBe('tacos');
    expect(product.price).toBe(3);
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
  it('should not add a product when the price is not a number', async () => {
    const req = {
      body: {
        name: 'soda',
        price: 'five',
      },
    };
    const result = await addProduct(req, resp, next);
    expect(result).toBe(400);
  });
  it('should not get, delete and update a product when it does not exists', async () => {
    const req = {
      params: {
        productId: 'error',
      },
      body: {
        name: 'test',
      },
    };
    const result = await getOneProduct(req, resp, next);
    const result2 = await updateProduct(req, resp, next);
    const result3 = await deleteProduct(req, resp, next);
    expect(result).toBe(404);
    expect(result2).toBe(404);
    expect(result3).toBe(404);
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
    const result = await updateProduct(req, resp, next);
    const result2 = await updateProduct(wrongPriceReq, resp, next);
    const result4 = await updateProduct(wrongDateReq, resp, next);
    expect(result.name).toBe('bacon');
    expect(result2).toBe(400);
    expect(result4).toBe(400);
  });
  it('should not update a product when the body is empty', async () => {
    const req = {
      body: {},
    };
    const result = await updateProduct(req, resp, next);
    expect(result).toBe(400);
  });
  it('should not update or delete a product when the ObjectId is wrong', async () => {
    const req = {
      params: {
        productId: '5f0f8080ab0857cd368ab972',
      },
      body: {
        price: 16,
      },
    };
    const result1 = await updateProduct(req, resp, next);
    const result2 = await deleteProduct(req, resp, next);
    expect(result1).toBe(404);
    expect(result2).toBe(404);
  });
  it('should delete a product', async () => {
    const products = await getProducts(standardReq, resp, next);
    const ids = products.map((item) => item._id);
    const req2 = {
      params: {
        productId: ids[0],
      },
    };
    const result = await deleteProduct(req2, resp, next);
    expect(result._doc).toEqual(products[0]._doc);
    const result2 = await getOneProduct(req2, resp, next);
    expect(result2).toBe(404);
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });
});
