const bcrypt = require('bcrypt');
const User = require('../database/user-schema');

module.exports = {
  getUsers: (req, resp, next) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    return User.paginate({}, { select: '-password', page, limit }, (err, users) => {
      if (err) {
        return next(500);
      }
      // resp.setHeader('Link', pagination);
      return resp.status(200).json(users.docs);
    });
  },
  getOneUser: (req, resp, next) => {
    const { uid } = req.params;
    const field = uid.match(/@/g) ? 'email' : '_id';
    return User.findOne({ [field]: uid }, { password: 0 }, (err, dbUser) => {
      if (err) {
        return next(500);
      }
      if (!dbUser) {
        return next(404);
      }
      return resp.status(200).json(dbUser);
    });
  },
  addUser: async (req, resp, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(400);
    }
    User.findOne({ email }, (err, dbUser) => {
      if (dbUser) {
        return next(403);
      }
    });
    req.body.password = bcrypt.hashSync(password, 10);
    const user = new User(req.body);
    try {
      const savedUser = await user.save();
      return resp.status(200).json({
        _id: savedUser._id,
        email,
        roles: savedUser.roles,
      });
    } catch (e) {
      return next(500);
    }
  },
  updateUser: async (req, resp, next) => {
    const { uid } = req.params;
    const { email, password, roles } = req.body;
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
      req.body.password = bcrypt.hashSync(password, 10);
      const fieldEditedValue = field === 'email' ? email : uid;
      await User.updateOne({ [field]: uid }, req.body);
      const doc = await User.findOne({ [field]: fieldEditedValue }, { password: 0 });
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
    const field = uid.match(/@/g) ? 'email' : '_id';
    try {
      const doc = await User.findOne({ [field]: uid }, { password: 0 });
      if (!doc) {
        return next(404);
      }
      await User.deleteOne({ [field]: uid });
      return resp.status(200).json(doc);
    } catch (e) {
      return next(500);
    }
  },
};
