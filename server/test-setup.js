const path = require("path");
require("dotenv").config({ path: path.resolve(process.cwd(), ".env.test") });

const db = require("./db");

global.clearDb = async () => {
  await db.pool.query(`DELETE FROM job_tags`);
  await db.pool.query(`DELETE FROM job`);
  await db.pool.query(`DELETE FROM company`);
  await db.pool.query(`DELETE FROM tag`);
};

global.endDb = async () => {
  await db.end();
};
