require("dotenv").config();
const next = require("next");
const server = require("./server/app");
const telegramBot = require("./server/telegram_bot");
const redis = require("./server/redis");

const port = process.env.PORT || 3000;
const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  server.get("/pending-jobs/:jobId", (req, res) => {
    return app.render(req, res, "/pending-jobs", { jobId: req.params.jobId });
  });
  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`Server running on http://localhost:${port}`);
    setupTelegramBot();
  });
});

async function setupTelegramBot() {
  try {
    //redis.flushall();
    await telegramBot.setupWebhook();
  } catch (err) {
    console.log(err);
  }
}

//setupTelegramBot();
