const {
  requireAuth,
  requireAdmin,
} = require('../middleware/auth');
const {
  getProducts,
  getOneProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} = require('../controller/products');

module.exports = (app, nextMain) => {
  app.get('/products', requireAuth, getProducts);

  app.get('/products/:productId', requireAuth, getOneProduct);

  app.post('/products', requireAdmin, addProduct);

  app.put('/products/:productId', requireAdmin, updateProduct);

  app.delete('/products/:productId', requireAdmin, deleteProduct);

  nextMain();
};
