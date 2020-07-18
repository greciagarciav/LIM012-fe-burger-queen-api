const bcrypt = require('bcrypt');
const User = require('../database/user-schema');
const { paginate } = require('./pagination');

module.exports = {
  getUsers: (req, resp, next) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    return User.paginate({}, { select: '-password', page, limit }, (err, users) => {
      if (err) {
        return next(500);
      }
      const pagination = paginate(req, page, limit, users);
      if (pagination) {
        resp.setHeader('link', pagination);
      }
      return resp.status(200).json(users.docs);
    });
  },
  getOneUser: (req, resp, next) => {
    const { uid } = req.params;
    const field = uid.match(/@/g) ? 'email' : '_id';
    return User.findOne({ [field]: uid }, { password: 0 }, (err, dbUser) => {
      if (err || !dbUser) {
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
    const dbUser = await User.findOne({ email });
    if (dbUser) {
      return next(403);
    }
    if (password.length < 5) {
      return next(400);
    }
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
      return next(400);
    }
  },
  updateUser: async (req, resp, next) => {
    const { uid } = req.params;
    const { email, password, roles } = req.body;
    const field = uid.match(/@/g) ? 'email' : '_id';
    try {
      const userExists = await User.findOne({ [field]: uid });
      if (!userExists) {
        throw new Error('Not Found');
      }
      const userData = req.headers.user;
      if (roles) {
        if (!userData.roles.admin && roles.admin !== userData.roles.admin) {
          return next(403);
        }
      }
      if ((!email && !password) || (password && password.length < 5)) {
        return next(400);
      }
      if (email && email === userData.email) {
        delete req.body.email;
      }
      if (password) {
        req.body.password = bcrypt.hashSync(password, 10);
      }
      const doc = await User.findOneAndUpdate({ [field]: uid }, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
        context: 'query',
        select: '-password',
      });
      return resp.status(200).json(doc);
    } catch (e) {
      if (e.message === 'Not Found' || e.kind === 'ObjectId') {
        return next(404);
      }
      return next(400);
    }
  },
  deleteUser: async (req, resp, next) => {
    const { uid } = req.params;
    const field = uid.match(/@/g) ? 'email' : '_id';
    try {
      const doc = await User.findOne({ [field]: uid }, { password: 0 });
      if (!doc) {
        throw new Error('Not Found');
      }
      await User.deleteOne({ [field]: uid });
      return resp.status(200).json(doc);
    } catch (e) {
      return next(404);
    }
  },
};
