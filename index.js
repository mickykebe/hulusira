require("dotenv").config();
const next = require("next");
const server = require("./server/app");
const telegramBot = require("./server/telegram_bot");
const redis = require("./server/redis");

const port = process.env.PORT || 3000;
const app = next(***REMOVED*** dev: process.env.NODE_ENV !== "production" ***REMOVED***);
const handle = app.getRequestHandler();

app.prepare().then(() => ***REMOVED***
  server.get("/pending-jobs/:jobId", (req, res) => ***REMOVED***
    return app.render(req, res, "/pending-jobs", ***REMOVED*** jobId: req.params.jobId ***REMOVED***);
  ***REMOVED***);
  server.get("*", (req, res) => ***REMOVED***
    return handle(req, res);
  ***REMOVED***);

  server.listen(port, err => ***REMOVED***
    if (err) throw err;
    console.log(`Server running on http://localhost:$***REMOVED***port***REMOVED***`);
    setupTelegramBot();
  ***REMOVED***);
***REMOVED***);

async function setupTelegramBot() ***REMOVED***
  try ***REMOVED***
    redis.flushall();
    await telegramBot.setupWebhook();
    console.log("setup telegram bot webhook");
  ***REMOVED*** catch (err) ***REMOVED***
    console.log(err);
  ***REMOVED***
***REMOVED***

//setupTelegramBot();
