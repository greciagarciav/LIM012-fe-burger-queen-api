const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { secret } = require('../config');

const User = require('../database/user-schema');

module.exports = async (req, resp, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(400);
  }
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Not Found');
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
    return next(404);
  }
};
