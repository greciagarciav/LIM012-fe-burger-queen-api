const Order = require('../database/order-schema');

module.exports = {
  getOrders: (req, resp, next) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    Order.paginate({}, { page, limit }, (err, orders) => {
      if (err) {
        return next(500);
      }
      return resp.status(200).json(orders.docs);
    });
  },
  getOneOrder: (req, resp, next) => {
    const { orderId } = req.params;
    Order.findOne({ _id: orderId }, (err, order) => {
      if (err.kind === 'ObjectId') {
        return next(400);
      }
      if (err) {
        return next(500);
      }
      if (!order) {
        return next(404);
      }
      return resp.status(200).json(order);
    });
  },
  addOrder: (req, resp, next) => {
    const {
      userId, products,
    } = req.body;
    if (!userId || !products) {
      return next(400);
    }
    const order = new Order(req.body);
    order.validateSync();
    order.save((err, newOrder) => {
      if (err._message === 'Orders validation failed') {
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
    try {
      await Order.updateOne({ _id: req.params.orderId }, req.body, { runValidators: true });
      const doc = await Order.findOne({ _id: req.params.orderId });
      if (!doc) {
        throw new Error('Not Found');
      }
      return resp.status(200).json(doc);
    } catch (e) {
      if (e._message === 'Validation failed') {
        return next(400);
      }
      return next(404);
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
      return next(500);
    }
  },
};
