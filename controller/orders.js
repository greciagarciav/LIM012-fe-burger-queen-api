const Order = require('../database/order-schema');
const Product = require('../database/product-schema');
const { paginate } = require('./pagination');

module.exports = {
  getOrders: (req, resp, next) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    return Order.paginate({}, { sort: 'dateEntry', page, limit }, (err, orders) => {
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
  getOneOrder: async (req, resp, next) => {
    const { orderId } = req.params;
    try {
      const doc = await Order.findOne({ _id: orderId });
      if (!doc) {
        throw new Error('Not Found');
      }
      return resp.status(200).json(doc);
    } catch (e) {
      return next(404);
    }
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
    try {
      const doc = await order.save();
      return resp.status(200).json(doc);
    } catch (e) {
      return next(400);
    }
  },
  // update products
  updateOrder: async (req, resp, next) => {
    if (Object.keys(req.body).length === 0) {
      return next(400);
    }
    const { status } = req.body;
    if (status && status === 'delivered') {
      req.body.dateProcessed = Date.now();
    }
    try {
      const doc = await Order.findOneAndUpdate({ _id: req.params.orderId }, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
        context: 'query',
      });
      if (!doc) {
        throw new Error('Not Found');
      }
      return resp.status(200).json(doc);
    } catch (e) {
      if (e.message === 'Not Found' || e.kind === 'ObjectId') {
        return next(404);
      }
      return next(400);
    }
  },
  deleteOrder: async (req, resp, next) => {
    try {
      const doc = await Order.findOneAndDelete({ _id: req.params.orderId });
      if (!doc) {
        throw new Error('Not Found');
      }
      return resp.status(200).json(doc);
    } catch (e) {
      return next(404);
    }
  },
};
