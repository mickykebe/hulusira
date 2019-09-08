require("dotenv").config();
const next = require('next');
const server = require('./server/app');

const port = process.env.PORT || 3000;
const app = next(***REMOVED*** dev: process.env.NODE_ENV !== "production" ***REMOVED***);
const handle = app.getRequestHandler();

app.prepare().then(() => ***REMOVED***
  server.get('*', (req, res) => ***REMOVED***
    return handle(req, res);
  ***REMOVED***);

  server.listen(port, err => ***REMOVED***
    if(err) throw err;
    console.log(`Server running on http://localhost:$***REMOVED***port***REMOVED***`);
  ***REMOVED***);
***REMOVED***);
