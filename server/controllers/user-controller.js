const bcrypt = require("bcryptjs");
const db = require("../db");

exports.me = async (req, res) => {
  if (req.user) {
    res.status(200).send(req.user.publicData());
    return;
  }
  res.sendStatus(401);
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await db.getUserByEmail(email);
  if (user) {
    const valid = await bcrypt.compare(password, user.password);
    if (valid && user.confirmed) {
      req.session.userId = user.id;
      res.status(200).send(user.publicData());
      return;
    }
  }
  res.sendStatus(401);
};
