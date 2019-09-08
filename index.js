require("dotenv").config();
const next = require('next');
const server = require('./server/app');

const port = process.env.PORT || 3000;
const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if(err) throw err;
    console.log(`Server running on http://localhost:${port}`);
  });
});
