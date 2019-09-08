const path = require("path");
require("dotenv").config(***REMOVED*** path: path.resolve(process.cwd(), ".env.test") ***REMOVED***);

const db = require("./db");

global.clearDb = async () => ***REMOVED***
  await db.pool.query(`DELETE FROM job_tags`);
  await db.pool.query(`DELETE FROM job`);
  await db.pool.query(`DELETE FROM company`);
  await db.pool.query(`DELETE FROM tag`);
***REMOVED***;

global.endDb = async () => ***REMOVED***
  await db.end();
***REMOVED***;
