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

describe('Orders', () => {
  beforeAll((done) => {
    mockMongoose.prepareStorage().then(() => {
      connectToDB('mongodb://127.0.0.1/BurguerQueen');
      mongoose.connection.on('connected', async () => {
        done();
      });
    });
  });
  it('should add an order, get it and updated', async () => {
    const product = await new Product({
      name: 'fakeBurguer',
      price: 7,
    }).save();
    const req = {
      body: {
        userId: '65vgr76v5e4swvky7u',
        products: [{ productId: product._id, qty: 3 }],
      },
    };
    const result = await addOrder(req, resp, next);
    if (result) {
      const req2 = {
        params: {
          orderId: result._id,
        },
        body: {
          status: 'delivering',
        },
      };
      expect(result.userId).toBe('65vgr76v5e4swvky7u');
      expect(result.products[0].product.name).toBe('fakeBurguer');
      expect(result.products[0].product.price).toBe(7);
      expect(result.status).toBe('pending');
      const order = await getOneOrder(req2, resp, next);
      expect(order.userId).toBe('65vgr76v5e4swvky7u');
      expect(order.products[0].product.name).toBe('fakeBurguer');
      expect(order.products[0].product.price).toBe(7);
      expect(order.status).toBe('pending');
      const orderUpdated = await updateOrder(req2, resp, next);
      expect(orderUpdated).toBe('delivering');
    }
  });
  it('should add an order and be available to deleted', async () => {
    const product = await new Product({
      name: 'fakeHotdog',
      price: 8,
    }).save();
    const req = {
      body: {
        userId: '222222222222',
        products: [{ productId: product._id, qty: 1 }],
      },
    };
    const result = await addOrder(req, resp, next);
    if (result) {
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
    }
  });
  it('should get orders', async () => {
    const req = {
      query: {
        page: 1,
        limit: 5,
      },
    };
    const result = await getOrders(req, resp, next);
    if (result) {
      expect(result.length).toBe(1);
      expect(result[0].products[0].product.name).toBe('fakeBurguer');
      expect(result[0].products[0].product.price).toBe(7);
    }
  });
  afterAll(async () => {
    await mockMongoose.helper.reset();
    await mockMongoose.killMongo();
  });
});
