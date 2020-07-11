const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');

const { secret } = config;
const User = require('../database/user-schema');

/** @module auth */
module.exports = (app, nextMain) => {
  /**
   * @name /auth
   * @description Crea token de autenticación.
   * @path {POST} /auth
   * @body {String} email Correo
   * @body {String} password Contraseña
   * @response {Object} resp
   * @response {String} resp.token Token a usar para los requests sucesivos
   * @code {200} si la autenticación es correcta
   * @code {400} si no se proveen `email` o `password` o ninguno de los dos
   * @auth No requiere autenticación, comprender mejor esta parte
   */
  app.post('/auth', (req, resp, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(400);
    }
    User.findOne({ email }, (err, dbUser) => {
      // TODO: autenticar a la usuarix
      if (err) {
        return next(500);
      }
      if (!dbUser) {
        return next(404);
      }
      if (!bcrypt.compareSync(password, dbUser.password)) {
        return next(403);
      }
      return dbUser;
    }).then((user) => {
      const token = jwt.sign({
        uid: user._id,
      }, secret, {
        expiresIn: 60 * 60 * 24,
      });
      resp.json({
        auth: true,
        user,
        token,
      });
    }).catch(() => next(500));
  });

  return nextMain();
};
