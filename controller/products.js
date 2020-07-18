const Product = require('../database/product-schema');
const { paginate } = require('./pagination');

module.exports = {
  getProducts: (req, resp, next) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    return Product.paginate({}, { page, limit }, (err, products) => {
      if (err) {
        return next(500);
      }
      const pagination = paginate(req, page, limit, products);
      if (pagination) {
        resp.setHeader('link', pagination);
      }
      return resp.status(200).json(products.docs);
    });
  },
  getOneProduct: async (req, resp, next) => {
    const { productId } = req.params;
    try {
      const doc = await Product.findOne({ _id: productId });
      if (!doc) {
        throw new Error('Not Found');
      }
      return resp.status(200).json(doc);
    } catch (e) {
      return next(404);
    }
  },
  addProduct: async (req, resp, next) => {
    const {
      name, price,
    } = req.body;
    if (!name || !price) {
      return next(400);
    }
    const product = new Product(req.body);
    try {
      const doc = await product.save();
      return resp.status(200).json(doc);
    } catch (e) {
      return next(400);
    }
  },
  updateProduct: async (req, resp, next) => {
    if (Object.keys(req.body).length === 0) {
      return next(400);
    }
    try {
      const doc = await Product.findOneAndUpdate({ _id: req.params.productId }, req.body, {
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
  deleteProduct: async (req, resp, next) => {
    try {
      const doc = await Product.findOneAndDelete({ _id: req.params.productId });
      if (!doc) {
        throw new Error('Not Found');
      }
      return resp.status(200).json(doc);
    } catch (e) {
      return next(404);
    }
  },
};
