const Order = require('../database/order-schema');
const Product = require('../database/product-schema');
const { paginate } = require('./pagination');

module.exports = {
  getOrders: (req, resp, next) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    Order.paginate({}, { sort: 'dateEntry', page, limit }, (err, orders) => {
      if (err) {
        return next(500);
      }
      const pagination = paginate(req, page, limit, orders);
      if (pagination) {
        resp.setHeader('link', pagination);
      }
      return resp.status(200).json(orders.docs);
    });
  },
  getOneOrder: (req, resp, next) => {
    const { orderId } = req.params;
    Order.findOne({ _id: orderId }, (err, order) => {
      if ((err && err.kind === 'ObjectId') || !order) {
        return next(404);
      }
      if (err) {
        return next(500);
      }
      return resp.status(200).json(order);
    });
  },
  addOrder: async (req, resp, next) => {
    const {
      userId, products,
    } = req.body;
    if (!userId || !products) {
      return next(400);
    }
    if (!Array.isArray(products)) {
      return next(400);
    }
    req.body.products = await Promise.all(products.map(async (product) => {
      const { productId, qty } = product;
      const { name, price } = await Product.findById(productId);
      const result = {
        product: {
          name,
          price,
        },
        qty,
      };
      return result;
    }));
    const order = new Order(req.body);
    order.validateSync();
    return order.save((err, newOrder) => {
      if (err && err._message === 'Orders validation failed') {
        return next(400);
      }
      if (err) {
        return next(500);
      }
      return resp.status(200).json(newOrder);
    });
  },
  updateOrder: async (req, resp, next) => {
    if (Object.keys(req.body).length === 0) {
      return next(400);
    }
    const { status } = req.body;
    if (status && status === 'delivered') {
      req.body.dateProcessed = Date.now();
    }
    try {
      await Order.updateOne({ _id: req.params.orderId }, req.body, { runValidators: true });
      const doc = await Order.findOne({ _id: req.params.orderId });
      if (!doc) {
        return next(404);
      }
      return resp.status(200).json(doc);
    } catch (e) {
      if (e._message === 'Validation failed' || e.kind === 'date') {
        return next(400);
      }
      if (e.kind === 'ObjectId') {
        return next(404);
      }
      return next(500);
    }
  },
  deleteOrder: async (req, resp, next) => {
    try {
      const doc = await Order.findOne({ _id: req.params.orderId });
      if (!doc) {
        return next(404);
      }
      await Order.deleteOne({ _id: req.params.orderId });
      return resp.status(200).json(doc);
    } catch (e) {
      if (e.kind === 'ObjectId') {
        return next(404);
      }
      return next(500);
    }
  },
};
