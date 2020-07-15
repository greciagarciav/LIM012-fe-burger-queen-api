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
  getOneProduct: (req, resp, next) => {
    const { productId } = req.params;
    return Product.findOne({ _id: productId }, (err, product) => {
      if ((err && err.kind === 'ObjectId') || !product) {
        return next(404);
      }
      if (err) {
        return next(500);
      }
      return resp.status(200).json(product);
    });
  },
  addProduct: (req, resp, next) => {
    const {
      name, price,
    } = req.body;
    if (!name || !price) {
      return next(400);
    }
    const product = new Product(req.body);
    return product.save((err, newProduct) => {
      if (err && err._message === 'Products validation failed') {
        return next(400);
      }
      if (err) {
        return next(500);
      }
      return resp.status(200).json(newProduct);
    });
  },
  updateProduct: async (req, resp, next) => {
    if (Object.keys(req.body).length === 0) {
      return next(400);
    }
    try {
      await Product.updateOne({ _id: req.params.productId }, req.body);
      const doc = await Product.findOne({ _id: req.params.productId });
      if (!doc) {
        return next(404);
      }
      return resp.status(200).json(doc);
    } catch (e) {
      if (e.kind === 'ObjectId') {
        return next(404);
      }
      if (e._message === 'Validation failed' || e.kind === 'date') {
        return next(400);
      }
      return next(400);
    }
  },
  deleteProduct: async (req, resp, next) => {
    try {
      const doc = await Product.findOne({ _id: req.params.productId });
      if (!doc) {
        return next(404);
      }
      await Product.deleteOne({ _id: req.params.productId });
      return resp.status(200).json(doc);
    } catch (e) {
      if (e.kind === 'ObjectId') {
        return next(404);
      }
      return next(500);
    }
  },
};
