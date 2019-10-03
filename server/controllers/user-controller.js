const bcrypt = require("bcryptjs");
const db = require("../db");
const { sendEmail } = require("../utils/send-email");
const {
  createConfirmationUrl,
  confirmUserPrefix
} = require("../utils/create-confirmation-url");
const redis = require("../redis");

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

exports.register = async (req, res) => {
  const userData = req.body;
  const user = await db.createUser(userData);
  const confirmationUrl = await createConfirmationUrl(user.id);
  await sendEmail(
    user.email,
    `Hi ${user.firstName} ${user.lastName}, please verify your HuluSira account`,
    "Thanks for signing up to HuluSira. Please activate your account by clicking the activation link.",
    `Hi, <br /><br /> Thanks for using HuluSira! Please confirm your email address by clicking the link below. <br /><br /> <a href="${confirmationUrl}">${confirmationUrl}</a> <br /><br />If you did not signup for a HuluSira account please disregard this email. <br /><br /> Thanks <br />HuluSira`
  );
  res.status(200).send(user.publicData());
};

exports.confirmUser = async (req, res) => {
  const { token } = req.params;
  const confirmationKey = confirmUserPrefix + token;
  const userId = await redis.get(confirmationKey);
  if (!userId) {
    res.sendStatus(500);
  }

  await db.confirmUser(parseInt(userId, 10));
  redis.del(confirmationKey);
  res.sendStatus(200);
};
