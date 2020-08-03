const {
  requireAuth,
} = require('../middleware/auth');
const {
  getOrders,
  getOneOrder,
  addOrder,
  updateOrder,
  deleteOrder,
} = require('../controller/orders');

module.exports = (app, nextMain) => {
  app.get('/orders', requireAuth, getOrders);

  app.get('/orders/:orderId', requireAuth, getOneOrder);

  app.post('/orders', requireAuth, addOrder);

  app.put('/orders/:orderId', requireAuth, updateOrder);

  app.delete('/orders/:orderId', requireAuth, deleteOrder);

  nextMain();
};
