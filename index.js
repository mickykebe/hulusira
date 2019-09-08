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

const app = next(***REMOVED*** dev: !isProduction ***REMOVED***);
const handle = app.getRequestHandler();

app.prepare().then(() => ***REMOVED***
  const server = express();
  server.use(cors());
  server.use(
    session(***REMOVED***
      store: new RedisStore(***REMOVED***
        client: redis
      ***REMOVED***),
      name: "qid",
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: ***REMOVED***
        httpOnly: true,
        secure: isProduction,
        maxAge: 1000 * 60 * 60 * 24 * 7
      ***REMOVED***
    ***REMOVED***)
  );

  server.use(async (req, res, next) => ***REMOVED***
    const userId = req.session.userId;
    if (userId) ***REMOVED***
      req.user = await db.getUserById(userId);
    ***REMOVED***
    next();
  ***REMOVED***);
  server.use("/api", routes);
  server.get('*', (req, res) => ***REMOVED***
    return handle(req, res);
  ***REMOVED***);

  server.listen(port, err => ***REMOVED***
    if(err) throw err;
    console.log(`Server running on http://localhost:$***REMOVED***port***REMOVED***`);
  ***REMOVED***);
***REMOVED***);



/* app.use(errorHandlers.notFound);
if (!isProduction) ***REMOVED***
  app.use(errorHandlers.developmentErrors);
***REMOVED***

app.use(errorHandlers.productionErrors);

app.listen(port, () => ***REMOVED***
  console.log(`server running on port $***REMOVED***port***REMOVED***`);
***REMOVED***); */
