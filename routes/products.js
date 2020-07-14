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

/** @module products */
module.exports = (app, nextMain) => {
  /**
   * x @name GET /products
   * x @description Lista productos
   * x @path {GET} /products
   * @query {String} [page=1] Página del listado a consultar
   * @query {String} [limit=10] Cantitad de elementos por página
   * @header {Object} link Parámetros de paginación
   * @header {String} link.first Link a la primera página
   * @header {String} link.prev Link a la página anterior
   * @header {String} link.next Link a la página siguiente
   * @header {String} link.last Link a la última página
   * x @auth Requiere `token` de autenticación
   * x @response {Array} products
   * x @response {String} products[]._id Id
   * x @response {String} products[].name Nombre
   * x @response {Number} products[].price Precio
   * x @response {URL} products[].image URL a la imagen
   * x @response {String} products[].type Tipo/Categoría
   * x @response {Date} products[].dateEntry Fecha de creación
   * x @code {200} si la autenticación es correcta
   * x @code {401} si no hay cabecera de autenticación
   */
  app.get('/products', requireAuth, getProducts);

  /**
   * x @name GET /products/:productId
   * x @description Obtiene los datos de un producto especifico
   * x @path {GET} /products/:productId
   * x @params {String} :productId `id` del producto
   * x @auth Requiere `token` de autenticación
   * x @response {Object} product
   * x @response {String} product._id Id
   * x @response {String} product.name Nombre
   * x @response {Number} product.price Precio
   * x @response {URL} product.image URL a la imagen
   * x @response {String} product.type Tipo/Categoría
   * x @response {Date} product.dateEntry Fecha de creación
   * x @code {200} si la autenticación es correcta
   * x @code {401} si no hay cabecera de autenticación
   * x @code {404} si el producto con `productId` indicado no existe
   */
  app.get('/products/:productId', requireAuth, getOneProduct);

  /**
   * x @name POST /products
   * x @description Crea un nuevo producto
   * x @path {POST} /products
   * x @auth Requiere `token` de autenticación y que la usuaria sea **admin**
   * x @body {String} name Nombre
   * x @body {Number} price Precio
   * x @body {String} [imagen]  URL a la imagen
   * x @body {String} [type] Tipo/Categoría
   * x @response {Object} product
   * x @response {String} products._id Id
   * x @response {String} product.name Nombre
   * x @response {Number} product.price Precio
   * x @response {URL} product.image URL a la imagen
   * x @response {String} product.type Tipo/Categoría
   * x @response {Date} product.dateEntry Fecha de creación
   * x @code {200} si la autenticación es correcta
   * x @code {400} si no se indican `name` o `price`
   * x @code {401} si no hay cabecera de autenticación
   * x @code {403} si no es admin
   * xxxxxx @code {404} si el producto con `productId` indicado no existe
   */
  app.post('/products', requireAdmin, addProduct);


  /**
   * x @name PUT /products
   * x @description Modifica un producto
   * x @path {PUT} /products
   * x @params {String} :productId `id` del producto
   * x @auth Requiere `token` de autenticación y que el usuario sea **admin**
   * x @body {String} [name] Nombre
   * x @body {Number} [price] Precio
   * x @body {String} [imagen]  URL a la imagen
   * x @body {String} [type] Tipo/Categoría
   * x @response {Object} product
   * x @response {String} product._id Id
   * x @response {String} product.name Nombre
   * x @response {Number} product.price Precio
   * x @response {URL} product.image URL a la imagen
   * x @response {String} product.type Tipo/Categoría
   * x @response {Date} product.dateEntry Fecha de creación
   * x @code {200} si la autenticación es correcta
   * x @code {400} si no se indican ninguna propiedad a modificar
   * x @code {401} si no hay cabecera de autenticación
   * x @code {403} si no es admin
   * xxxxx @code {404} si el producto con `productId` indicado no existe
   */
  app.put('/products/:productId', requireAdmin, updateProduct);

  /**
   * x @name DELETE /products
   * x @description Elimina un producto
   * x @path {DELETE} /products
   * x @params {String} :productId `id` del producto
   * x @auth Requiere `token` de autenticación y que el usuario sea **admin**
   * x @response {Object} product
   * x @response {String} product._id Id
   * x @response {String} product.name Nombre
   * x @response {Number} product.price Precio
   * x @response {URL} product.image URL a la imagen
   * x @response {String} product.type Tipo/Categoría
   * x @response {Date} product.dateEntry Fecha de creación
   * x @code {200} si la autenticación es correcta
   * x @code {401} si no hay cabecera de autenticación
   * x @code {403} si no es ni admin
   * xxxxx @code {404} si el producto con `productId` indicado no existe
   */
  app.delete('/products/:productId', requireAdmin, deleteProduct);

  nextMain();
};
