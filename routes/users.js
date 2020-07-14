const bcrypt = require('bcrypt');
const User = require('../database/user-schema');

const {
  requireAuth,
  requireAdmin,
  userAllowed,
} = require('../middleware/auth');

const {
  getUsers,
  getOneUser,
  addUser,
  updateUser,
  deleteUser,
} = require('../controller/users');

const initAdminUser = async (app, next) => {
  const { adminEmail, adminPassword } = app.get('config');
  if (!adminEmail || !adminPassword) {
    return next();
  }
  try {
    const user = await User.findOne({ email: adminEmail });
    if (!user) {
      throw new Error('No user admin yet!');
    }
  } catch (e) {
    new User({
      email: adminEmail,
      password: bcrypt.hashSync(adminPassword, 10),
      roles: { admin: true },
    }).save();
  }
  return next();
};


/*
 * Diagrama de flujo de una aplicación y petición en node - express :
 *
 * request  -> middleware1 -> middleware2 -> route
 *                                             |
 * response <- middleware4 <- middleware3   <---
 *
 * la gracia es que la petición va pasando por cada una de las funciones
 * intermedias o "middlewares" hasta llegar a la función de la ruta, luego esa
 * función genera la respuesta y esta pasa nuevamente por otras funciones
 * intermedias hasta responder finalmente a la usuaria.
 *
 * Un ejemplo de middleware podría ser una función que verifique que una usuaria
 * está realmente registrado en la aplicación y que tiene permisos para usar la
 * ruta. O también un middleware de traducción, que cambie la respuesta
 * dependiendo del idioma de la usuaria.
 *
 * Es por lo anterior que siempre veremos los argumentos request, response y
 * next en nuestros middlewares y rutas. Cada una de estas funciones tendrá
 * la oportunidad de acceder a la consulta (request) y hacerse cargo de enviar
 * una respuesta (rompiendo la cadena), o delegar la consulta a la siguiente
 * función en la cadena (invocando next). De esta forma, la petición (request)
 * va pasando a través de las funciones, así como también la respuesta
 * (response).
 */

/** @module users */
module.exports = (app, next) => {
  /**
   * @name GET /users
   * x @description Lista usuarias
   * x @path {GET} /users
   * x @query {String} [page=1] Página del listado a consultar
   * x @query {String} [limit=10] Cantitad de elementos por página
   * @header {Object} link Parámetros de paginación
   * @header {String} link.first Link a la primera página
   * @header {String} link.prev Link a la página anterior
   * @header {String} link.next Link a la página siguiente
   * @header {String} link.last Link a la última página
   * x @auth Requiere `token` de autenticación y que la usuaria sea **admin**
   * x @response {Array} users
   * x @response {String} users[]._id
   * x @response {Object} users[].email
   * x @response {Object} users[].roles
   * x @response {Boolean} users[].roles.admin
   * x @code {200} si la autenticación es correcta
   * x @code {401} si no hay cabecera de autenticación
   * x @code {403} si no es ni admin
   */
  app.get('/users', requireAdmin, getUsers);

  /**
   * x @name GET /users/:uid
   * x @description Obtiene información de una usuaria
   * x @path {GET} /users/:uid
   * x @params {String} :uid `id` o `email` de la usuaria a consultar
   * x @auth Requiere `token` de autenticación
   *   y que la usuaria sea **admin** o la usuaria a consultar
   * x @response {Object} user
   * x @response {String} user._id
   * x @response {Object} user.email
   * x @response {Object} user.roles
   * x @response {Boolean} user.roles.admin
   * x @code {200} si la autenticación es correcta
   * x @code {401} si no hay cabecera de autenticación
   * x @code {403} si no es ni admin o la misma usuaria
   * x @code {404} si la usuaria solicitada no existe
   */
  app.get('/users/:uid', requireAuth, userAllowed, getOneUser);

  /**
   * @name POST /users
   * x @description Crea una usuaria
   * x @path {POST} /users
   * x @body {String} email Correo
   * x @body {String} password Contraseña
   * x @body {Object} [roles]
   * x @body {Boolean} [roles.admin]
   * x @auth Requiere `token` de autenticación y que la usuaria sea **admin**
   * x @response {Object} user
   * x @response {String} user._id
   * x @response {Object} user.email
   * x @response {Object} user.roles
   * x @response {Boolean} user.roles.admin
   * x @code {200} si la autenticación es correcta
   * x @code {400} si no se proveen `email` o `password` o ninguno de los dos
   * x @code {401} si no hay cabecera de autenticación
   * x @code {403} si ya existe usuaria con ese `email`
   */
  app.post('/users', requireAdmin, addUser);

  /**
   * x @name PUT /users
   * x @description Modifica una usuaria
   * x @params {String} :uid `id` o `email` de la usuaria a modificar
   * x @path {PUT} /users
   * x @body {String} email Correo
   * x @body {String} password Contraseña
   * x @body {Object} [roles]
   * x @body {Boolean} [roles.admin]
   * x @auth Requiere `token` de autenticación
   *   y que la usuaria sea **admin** o la usuaria a modificar
   * x @response {Object} user
   * x @response {String} user._id
   * x @response {Object} user.email
   * x @response {Object} user.roles
   * x @response {Boolean} user.roles.admin
   * x @code {200} si la autenticación es correcta
   * x @code {400} si no se proveen `email` o `password` o ninguno de los dos
   * x @code {401} si no hay cabecera de autenticación
   * x @code {403} si no es ni admin o la misma usuaria
   * x @code {403} una usuaria no admin intenta de modificar sus `roles`
   * x @code {404} si la usuaria solicitada no existe
   */
  app.put('/users/:uid', requireAuth, userAllowed, updateUser);

  /**
   * x @name DELETE /users
   * x @description Elimina una usuaria
   * x @params {String} :uid `id` o `email` de la usuaria a modificar
   * x @path {DELETE} /users
   * x @auth Requiere `token` de autenticación
   *   y que la usuaria sea **admin** o la usuaria a eliminar
   * x @response {Object} user
   * x @response {String} user._id
   * x @response {Object} user.email
   * x @response {Object} user.roles
   * x @response {Boolean} user.roles.admin
   * x @code {200} si la autenticación es correcta
   * x @code {401} si no hay cabecera de autenticación
   * x @code {403} si no es ni admin o la misma usuaria
   * x @code {404} si la usuaria solicitada no existe
   */
  app.delete('/users/:uid', requireAuth, userAllowed, deleteUser);

  initAdminUser(app, next);
};
