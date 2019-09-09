const db = require('../db');

exports.loadUser = async (req, _res, next) => {
  const userId = req.session.userId;
  if (userId) {
    req.user = await db.getUserById(userId);
  }
  next();
};