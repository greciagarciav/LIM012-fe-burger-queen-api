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
  app.post('/auth', async (req, resp, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(400);
    }
    try {
      const user = await User.findOne({ email });
      if (!user) return next(404);
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({
          uid: user._id,
        }, secret, {
          expiresIn: 60 * 60 * 24,
        });
        return resp.status(200).json({ token });
      }
      return next(403);
    } catch (e) {
      return next(500);
    }
  });

  return nextMain();
};
