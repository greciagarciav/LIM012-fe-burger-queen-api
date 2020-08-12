const mongoose = require('mongoose');
const Product = require('../../database/product-schema');

const {
  getOrders,
  getOneOrder,
  addOrder,
  deleteOrder,
  updateOrder,
} = require('../orders');
const { resp, next } = require('./mock-express');
const { connectToDB } = require('../../database/db-connect');

const wrongIdReq = {
  params: {
    orderId: '676bfr754v4767ggv',
  },
};
describe('Orders', () => {
  beforeAll(async () => {
    await connectToDB(process.env.MONGO_URL);
  });
  it('should add an order and be able to update it when the values given are ok and reject it when not', async () => {
    const product = new Product({
      name: 'fakeBurguer',
      price: 7,
    }).save();
    Promise.resolve(product).then(async (actualProduct) => {
      const req = {
        body: {
          userId: '65vgr76v5e4swvky7u',
          products: [{ productId: actualProduct._id, qty: 3 }],
          client: 'usuarix',
        },
      };
      const result = await addOrder(req, resp, next);
      return result;
    }).then(async (order) => {
      const req = {
        params: {
          orderId: order._id,
        },
        body: {
          status: 'delivered',
        },
      };
      const req2 = {
        params: {
          orderId: order._id,
        },
        body: {
          status: 'finished',
        },
      };
      const orderUpdated = await updateOrder(req, resp, next);
      const failedOrderUpdated = await updateOrder(req2, resp, next);
      expect(order.userId).toBe('65vgr76v5e4swvky7u');
      expect(order.products[0].product.name).toBe('fakeBurguer');
      expect(order.products[0].product.price).toBe(7);
      expect(order.status).toBe('pending');
      expect(order.client).toBe('usuarix');
      expect(orderUpdated.status).toBe('delivered');
      expect(orderUpdated.dateProcessed).toBeDefined();
      expect(failedOrderUpdated).toBe(400);
    });
  });
  it('should update the products', async () => {
    const product = new Product({
      name: 'fries',
      price: 2,
    }).save();
    const product2 = new Product({
      name: 'cheese',
      price: 3,
    }).save();
    Promise.all([product, product2]).then(async (products) => {
      const req = {
        body: {
          userId: '65vgr76v5e4swvky7u',
          products: [{ productId: products[0]._id, qty: 3 }],
          client: 'usuarix',
        },
      };
      const order = await addOrder(req, resp, next);
      return [order, products[1]];
    }).then(async (result) => {
      const req = {
        params: {
          orderId: result[0]._id,
        },
        body: {
          products: [
            { productId: result[0].products[0].product._id, qty: 1 },
          ],
        },
      };
      const req2 = {
        params: {
          orderId: result[0]._id,
        },
        body: {
          products: [
            { productId: result[1]._id, qty: 2 },
            { productId: result[0].products[0].product._id, qty: 0 },
          ],
        },
      };
      const orderUpdated = await updateOrder(req, resp, next);
      const orderUpdated2 = await updateOrder(req2, resp, next);
      expect(orderUpdated.products[0].qty).toBe(1);
      expect(orderUpdated2.total).toBe(6);
      expect(orderUpdated2.products[0].qty).toBe(2);
      expect(orderUpdated2.products[0].product.name).toBe('cheese');
      expect(orderUpdated2.products[0].product.price).toBe(3);
    });
  });
  it('should get one order by id', () => {
    const product1 = new Product({
      name: 'fakeHotDog',
      price: 7,
    }).save();
    const product2 = new Product({
      name: 'fakeChicken',
      price: 7,
    }).save();
    Promise.all([product1, product2]).then((products) => {
      const req1 = {
        body: {
          userId: 'user1',
          products: [{ productId: products[0]._id, qty: 3 }],
        },
      };
      const req2 = {
        body: {
          userId: 'user2',
          products: [{ productId: products[1]._id, qty: 10 }],
        },
      };
      const order1 = addOrder(req1, resp, next);
      const order2 = addOrder(req2, resp, next);
      return Promise.all([order1, order2]);
    }).then(([order1, order2]) => {
      const req1 = {
        params: {
          orderId: order1._id,
        },
      };
      const req2 = {
        params: {
          orderId: order2._id,
        },
      };
      const findOrder1 = getOneOrder(req1, resp, next);
      const findOrder2 = getOneOrder(req2, resp, next);
      return Promise.all([findOrder1, findOrder2]);
    }).then((responses) => {
      expect(responses[0].userId).toBe('user1');
      expect(responses[0].products[0].product.name).toBe('fakeHotDog');
      expect(responses[0].products[0].qty).toBe(3);
      expect(responses[1].userId).toBe('user2');
      expect(responses[1].products[0].product.name).toBe('fakeChicken');
      expect(responses[1].products[0].qty).toBe(10);
    });
  });
  it('should add an order and be able to delete it', async () => {
    const product = new Product({
      name: 'fakeMeat',
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
      expect(order.products[0].product.name).toBe('fakeMeat');
      expect(order.products[0].product.price).toBe(8);
      expect(order.status).toBe('pending');
      const orderExists = await getOneOrder(req2, resp, next);
      expect(orderExists).toBe(404);
    });
  });
  it('should not add an order when the status is not valid', async () => {
    const product = new Product({
      name: 'fakeEgg',
      price: 2,
    }).save();
    Promise.resolve(product).then(async (actualProduct) => {
      const req = {
        body: {
          userId: '3333333333',
          products: [{ productId: actualProduct._id, qty: 1 }],
          status: 'accepted',
        },
      };
      const result = await addOrder(req, resp, next);
      expect(result).toBe(400);
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
  it('should not update, delete or get an order when is not found', async () => {
    const req = {
      body: {
        status: 'delivered',
      },
      params: {
        productId: '5f0f8080ab0857cd368ab972',
      },
    };
    const result = await updateOrder(req, resp, next);
    const result2 = await deleteOrder(req, resp, next);
    const result3 = await getOneOrder(req, resp, next);
    expect(result).toBe(404);
    expect(result2).toBe(404);
    expect(result3).toBe(404);
  });
  it('should not delete or get an order when the id is wrong', async () => {
    const result = await deleteOrder(wrongIdReq, resp, next);
    const result2 = await getOneOrder(wrongIdReq, resp, next);
    expect(result).toBe(404);
    expect(result2).toBe(404);
  });
  it('should get orders', async () => {
    const req = {
      query: {
        page: 2,
        limit: 1,
      },
    };
    const req2 = {
      query: {
        page: 3,
        limit: 1,
      },
    };
    const result = await getOrders(req, resp, next);
    const result2 = await getOrders(req2, resp, next);
    expect(result.length).toBe(1);
    expect(result[0].products[0].product.name).toBe('fries');
    expect(result2[0].products[0].product.name).toBe('fakeHotDog');
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });
});
