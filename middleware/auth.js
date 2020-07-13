const jwt = require('jsonwebtoken');
const User = require('../database/user-schema');

module.exports = (secret) => (req, resp, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next();
  }

  const [type, token] = authorization.split(' ');
  if (type.toLowerCase() !== 'bearer') {
    return next();
  }

  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      return next(403);
    }

    const userId = decodedToken.uid;
    User.findOne({ _id: userId }).then((user) => {
      req.headers.user = user;
      next();
    }).catch(() => {
      next(403);
    });

    // TODO: Verificar identidad del usuario usando `decodeToken.uid`
  });
};


// TODO: decidir por la informacion del request si la usuaria esta autenticada
module.exports.isAuthenticated = (req) => (req.headers.user);


// TODO: decidir por la informacion del request si la usuaria es admin
module.exports.isAdmin = (req) => (req.headers.user.roles.admin);

module.exports.userAllowed = (req, resp, next) => {
  const currentUser = req.headers.user;
  const { uid } = req.params;
  const field = uid.match(/@/g) ? 'email' : '_id';
  if (currentUser.roles.admin && currentUser[field] === uid) {
    return next(403);
  }
  return next();
};

module.exports.requireAuth = (req, resp, next) => (
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : next()
);


module.exports.requireAdmin = (req, resp, next) => (
  // eslint-disable-next-line no-nested-ternary
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : (!module.exports.isAdmin(req))
      ? next(403)
      : next()
);
