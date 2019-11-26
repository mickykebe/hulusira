const bcrypt = require("bcryptjs");
const ***REMOVED*** v4 ***REMOVED*** = require("uuid");
const crypto = require("crypto");
const db = require("../db");
const ***REMOVED*** sendEmail ***REMOVED*** = require("../utils/send-email");

exports.me = async (req, res) => ***REMOVED***
  if (req.user) ***REMOVED***
    res.status(200).send(req.user.publicData());
    return;
  ***REMOVED***
  res.sendStatus(401);
***REMOVED***;

exports.login = async (req, res) => ***REMOVED***
  const ***REMOVED*** email, password ***REMOVED*** = req.body;
  const user = await db.getUserByEmail(email);
  if (user) ***REMOVED***
    const valid = await bcrypt.compare(password, user.password);
    if (valid && user.confirmed) ***REMOVED***
      req.session.userId = user.id;
      res.status(200).send(user.publicData());
      return;
    ***REMOVED***
  ***REMOVED***
  res.sendStatus(401);
***REMOVED***;

exports.telegramLogin = async (req, res) => ***REMOVED***
  const ***REMOVED*** hash, ...userData ***REMOVED*** = req.body;
  const dataCheckStr = Object.keys(userData)
    .sort()
    .map(key => `$***REMOVED***key***REMOVED***=$***REMOVED***userData[key]***REMOVED***`)
    .join("\n");
  console.log(***REMOVED*** dataCheckStr ***REMOVED***);
  const secretKey = crypto
    .createHash("sha256")
    .update(process.env.TELEGRAM_BOT_TOKEN)
    .digest();
  const computedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckStr)
    .digest("hex");

  if (hash === computedHash && new Date() / 1000 - userData.auth_date < 86400) ***REMOVED***
    const user = await db.findOrCreateTelegramUser(***REMOVED***
      role: "user",
      ...userData
    ***REMOVED***);
    req.session.userId = user.id;
    res.status(200).send(user.publicData());
    return;
  ***REMOVED***
  res.sendStatus(401);
***REMOVED***;

exports.register = async (req, res) => ***REMOVED***
  const userData = ***REMOVED*** role: "user", ...req.body ***REMOVED***;
  const user = await db.createUser(userData);
  const confirmationKey = v4();
  await db.createUserConfirmation(user.id, confirmationKey);
  const confirmationUrl = `$***REMOVED***process.env.ROOT_URL***REMOVED***/confirm-user/$***REMOVED***confirmationKey***REMOVED***`;
  await sendEmail(
    user.email,
    `Hi $***REMOVED***user.firstName***REMOVED*** $***REMOVED***user.lastName***REMOVED***, please verify your HuluSira account`,
    "Thanks for signing up to HuluSira. Please activate your account by clicking the activation link.",
    `Hi, <br /><br /> Thanks for using HuluSira! Please confirm your email address by clicking the link below. <br /><br /> <a href="$***REMOVED***confirmationUrl***REMOVED***">$***REMOVED***confirmationUrl***REMOVED***</a> <br /><br />If you did not signup for a HuluSira account please disregard this email. <br /><br /> Thanks <br />HuluSira`
  );
  res.status(200).send(user.publicData());
***REMOVED***;

exports.confirmUser = async (req, res) => ***REMOVED***
  const ***REMOVED*** confirmationKey ***REMOVED*** = req.params;
  const userConfirmation = await db.getUserConfirmation(confirmationKey);
  if (!userConfirmation) ***REMOVED***
    res.sendStatus(500);
    return;
  ***REMOVED***
  const userId = userConfirmation.userId;

  await db.confirmUser(userId);
  req.session.userId = userId;
  await db.deleteUserConfirmation(userId);
  res.sendStatus(200);
***REMOVED***;

exports.logout = async (req, res) => ***REMOVED***
  if (req.session) ***REMOVED***
    req.session.destroy(err => ***REMOVED***
      if (err) ***REMOVED***
        throw err;
      ***REMOVED***
      res.sendStatus(200);
    ***REMOVED***);
  ***REMOVED***
***REMOVED***;
