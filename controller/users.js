const bcrypt = require('bcrypt');
const User = require('../database/user-schema');
const { userAllowed } = require('../middleware/auth');

module.exports = {
  getUsers: (req, resp, next) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    User.paginate({}, { select: '-password', page, limit }, (err, users) => {
      if (err) {
        return next(500);
      }
      resp.setHeader('Link', pagination);
      return resp.status(200).json(users);
    });
  },
  getOneUser: (req, resp, next) => {
    const { uid } = req.params;
    const field = uid.match(/@/g) ? 'email' : '_id';
    if (!userAllowed(req)) { return next(403); }
    User.findOne({ [field]: uid }, { password: 0 }, (err, dbUser) => {
      if (err || !dbUser) {
        return next(404);
      }
      return resp.status(200).json(dbUser);
    });
  },
  addUser: (req, resp, next) => {
    const { email, password, roles } = req.body;
    if (!email || !password) {
      return next(400);
    }
    User.findOne({ email }, (err, dbUser) => {
      if (dbUser) {
        return next(403);
      }
    });
    const user = new User({
      email,
      password: bcrypt.hashSync(password, 10),
      roles,
    });
    user.save((err, newUser) => {
      if (err) {
        return next(400);
      }
      return resp.status(200).json({
        _id: newUser._id,
        email,
        roles,
      });
    });
  },
  updateUser: async (req, resp, next) => {
    const { uid } = req.params;
    const { email, password, roles } = req.body;
    if (!userAllowed(req)) { return next(403); }
    const field = uid.match(/@/g) ? 'email' : '_id';
    const userIsAdminField = req.headers.user.roles.admin;
    if (roles) {
      if (!userIsAdminField && roles.admin !== userIsAdminField) {
        return next(403);
      }
    }
    if (!email || !password) {
      return next(400);
    }
    try {
      await User.updateOne({ [field]: uid }, req.body);
      const doc = await User.findOne({ [field]: uid }, { password: 0 });
      if (!doc) {
        throw new Error('not found');
      }
      return resp.status(200).json(doc);
    } catch (e) {
      return next(404);
    }
  },
  deleteUser: async (req, resp, next) => {
    const { uid } = req.params;
    if (!userAllowed(req)) {
      return next(403);
    }
    const field = uid.match(/@/g) ? 'email' : '_id';
    try {
      const doc = await User.findOne({ [field]: uid }, { password: 0 });
      if (!doc) {
        throw new Error('not found');
      }
      await User.deleteOne({ [field]: uid });
      return resp.status(200).json(doc);
    } catch (e) {
      return next(404);
    }
  },
};
