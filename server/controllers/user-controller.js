const bcrypt = require("bcryptjs");
const { v4 } = require("uuid");
const crypto = require("crypto");
const db = require("../db");
const { sendEmail } = require("../utils/send-email");

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

exports.telegramLogin = async (req, res) => {
  const { hash, ...userData } = req.body;
  const dataCheckStr = Object.keys(userData)
    .sort()
    .map((key) => `${key}=${userData[key]}`)
    .join("\n");
  console.log({ dataCheckStr });
  const secretKey = crypto
    .createHash("sha256")
    .update(process.env.TELEGRAM_BOT_TOKEN)
    .digest();
  const computedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckStr)
    .digest("hex");

  if (hash === computedHash && new Date() / 1000 - userData.auth_date < 86400) {
    const user = await db.findOrCreateTelegramUser({
      role: "user",
      ...userData,
    });
    req.session.userId = user.id;
    res.status(200).send(user.publicData());
    return;
  }
  res.sendStatus(401);
};

exports.register = async (req, res) => {
  const userData = { role: "user", ...req.body };
  const user = await db.createUser(userData);
  const confirmationKey = v4();
  await db.createUserConfirmation(user.id, confirmationKey);
  const confirmationUrl = `${process.env.NEXT_PUBLIC_ROOT_URL}/confirm-user/${confirmationKey}`;
  await sendEmail(
    user.email,
    `Hi ${user.firstName} ${user.lastName}, please verify your HuluSira account`,
    "Thanks for signing up to HuluSira. Please activate your account by clicking the activation link.",
    `Hi, <br /><br /> Thanks for using HuluSira! Please confirm your email address by clicking the link below. <br /><br /> <a href="${confirmationUrl}">${confirmationUrl}</a> <br /><br />If you did not signup for a HuluSira account please disregard this email. <br /><br /> Thanks <br />HuluSira`
  );
  res.status(200).send(user.publicData());
};

exports.confirmUser = async (req, res) => {
  const { confirmationKey } = req.params;
  const userConfirmation = await db.getUserConfirmation(confirmationKey);
  if (!userConfirmation) {
    res.sendStatus(500);
    return;
  }
  const userId = userConfirmation.userId;

  await db.confirmUser(userId);
  req.session.userId = userId;
  await db.deleteUserConfirmation(userId);
  res.sendStatus(200);
};

exports.logout = async (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        throw err;
      }
      res.sendStatus(200);
    });
  }
};
