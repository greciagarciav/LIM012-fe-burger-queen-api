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

module.exports = (app, next) => {
  app.get('/users', requireAdmin, getUsers);

  app.get('/users/:uid', requireAuth, userAllowed, getOneUser);

  app.post('/users', requireAdmin, addUser);

  app.put('/users/:uid', requireAuth, userAllowed, updateUser);

  app.delete('/users/:uid', requireAuth, userAllowed, deleteUser);

  initAdminUser(app, next);
};
