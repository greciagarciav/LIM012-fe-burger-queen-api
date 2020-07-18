/* eslint-disable no-console */
const mongoose = require('mongoose');
const { MockMongoose } = require('mock-mongoose');

const mockMongoose = new MockMongoose(mongoose);
const {
  getOrders,
  getOneOrder,
  addOrder,
  deleteOrder,
  updateOrder,
} = require('../../controller/orders');
const { connectToDB } = require('../../database/db-connect');
const Product = require('../../database/product-schema');

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
const wrongIdReq = {
  params: {
    orderId: '676bfr754v4767ggv',
  },
};
describe('Orders', () => {
  beforeAll((done) => {
    mockMongoose.prepareStorage().then(() => {
      connectToDB('mongodb://127.0.0.1/BurguerQueen');
      mongoose.connection.on('connected', () => {
        console.log('db connection is now open');
        done();
      });
    });
  });
  it('should add an order, get it and updated', async (done) => {
    const product = new Product({
      name: 'fakeBurguer',
      price: 7,
    }).save();
    Promise.resolve(product).then(async (actualProduct) => {
      const req = {
        body: {
          userId: '65vgr76v5e4swvky7u',
          products: [{ productId: actualProduct._id, qty: 3 }],
        },
      };
      const result = await addOrder(req, resp, next);
    return result;
    }).then(async(order) => {
      const req2 = {
        params: {
          orderId: order._id,
        },
        body: {
          status: 'delivering',
        },
      };
      const orderUpdated = await updateOrder(req2, resp, next);
      expect(order.userId).toBe('65vgr76v5e4swvky7u');
      expect(order.products[0].product.name).toBe('fakeBurguer');
      expect(order.products[0].product.price).toBe(7);
      expect(order.status).toBe('pending');
      expect(orderUpdated).toBe('delivering');
      done();
    });
  });
  it('should get orders', (done) => {
    const req = {
      query: {
        page: 1,
        limit: 4,
      },
    };
    Promise.resolve(getOrders(req, resp, next)).then((result) => {
      expect(result.length).toBe(2);
      expect(result[0].products[0].product.name).toBe('fakeBurguer');
      expect(result[0].products[0].product.price).toBe(7);
      done();
    });
  });
  it('should add an order and be available to deleted', async (done) => {
    const product = await new Product({
      name: 'fakeHotdog',
      price: 8,
    }).save();
    Promise.resolve(product).then(async (actualProduct) => {
      const req = {
        body: {
          userId: '222222222222',
          products: [{ productId: actualProduct._id, qty: 1 }],
        },
      };
      const result = await addOrder(req, resp, next);
      const req2 = {
        params: {
          orderId: result._id,
        },
      };
      const order = await deleteOrder(req2, resp, next);
      expect(order.userId).toBe('222222222222');
      expect(order.products[0].product.name).toBe('fakeHotdog');
      expect(order.products[0].product.price).toBe(8);
      expect(order.status).toBe('pending');
      const deletedOrder = getOneOrder(req2, resp, next);
      expect(deletedOrder).toBe(404);
      done();
    });
  });
  it('should not add an order when there is no products', async () => {
    const req = {
      body: {
        userId: '2226565908jb6dy6',
      },
    };
    const result = await addOrder(req, resp, next);
    expect(result).toBe(400);
  });
  it('should not add an order when products is not an array', async () => {
    const req = {
      body: {
        userId: '2226565908jb6dy6',
        products: 7,
      },
    };
    const result = await addOrder(req, resp, next);
    expect(result).toBe(400);
  });
  it('should not update an order when the body is empty', async () => {
    const req = {
      body: {},
    };
    const result = await updateOrder(req, resp, next);
    expect(result).toBe(400);
  });
  it('should not delete an order when is not found', async () => {
    const result = await deleteOrder(wrongIdReq, resp, next);
    expect(result).toBe(404);
  });
  it('should not get an order when is not found', (done) => {
    getOneOrder(wrongIdReq, resp, (num) => {
      expect(num).toBe(404);
      done();
    });
  });
  afterAll(async () => {
    await mockMongoose.helper.reset();
    await mockMongoose.killMongo();
  });
});
