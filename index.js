require("dotenv").config();
const next = require('next');
const bodyParser = require("body-parser");
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const connectRedis = require("connect-redis");
const errorHandlers = require("./server/handlers/errorHandler");
const routes = require("./server/routes/index");
const redis = require("./server/redis");
const db = require("./server/db");

const port = process.env.PORT || 3000;

const isProduction = process.env.NODE_ENV === "production";

const RedisStore = connectRedis(session);

const app = next({ dev: !isProduction });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.use(cors());
  server.use(
    session({
      store: new RedisStore({
        client: redis
      }),
      name: "qid",
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: isProduction,
        maxAge: 1000 * 60 * 60 * 24 * 7
      }
    })
  );

  server.use(async (req, res, next) => {
    const userId = req.session.userId;
    if (userId) {
      req.user = await db.getUserById(userId);
    }
    next();
  });
  server.use("/api", routes);
  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if(err) throw err;
    console.log(`Server running on http://localhost:${port}`);
  });
});



/* app.use(errorHandlers.notFound);
if (!isProduction) {
  app.use(errorHandlers.developmentErrors);
}

app.use(errorHandlers.productionErrors);

app.listen(port, () => {
  console.log(`server running on port ${port}`);
}); */
