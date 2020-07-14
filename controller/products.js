const Product = require('../database/product-schema');

module.exports = {
  getProducts: (req, resp, next) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    Product.paginate({}, { page, limit }, (err, products) => {
      if (err) {
        return next(500);
      }
      return resp.status(200).json(products.docs);
    });
  },
  getOneProduct: (req, resp, next) => {
    const { productId } = req.params;
    Product.findOne({ _id: productId }, (err, product) => {
      if (err.kind === 'ObjectId') {
        return next(400);
      }
      if (err) {
        return next(500);
      }
      if (!product) {
        return next(404);
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
    product.save((err, newProduct) => {
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
        throw new Error('Not Found');
      }
      return resp.status(200).json(doc);
    } catch (e) {
      return next(404);
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
      return next(500);
    }
  },
};
