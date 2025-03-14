require("dotenv").config({ path: `.${process.env.NODE_ENV}.env` });
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./router/index");
const path = require("path");
const resValidator = require("./middlewares/validator.middleware");
const markdownController = require("./controllers/markdown-controller");
const cron = require("node-cron");
const DB = require("./utils/db_query");

const PORT = process.env.PORT || 5000;
const app = express();

app.use((req, res, next) => {
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  next();
});
app.use("/static", express.static(path.join(__dirname, "static")));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use("/api", router);
app.get("/:id/raw", markdownController.get_raw);
app.use(resValidator);

let task = null;
let interval = "*/5 * * * * *";

const createCronTask = (cronInterval) => {
  if (task) task.stop();

  task = cron.schedule(cronInterval, async () => {
    const now = Date.now();
    var conc = new Date(now - 10 * 24 * 60 * 60 * 1000).getTime();
    await DB.query(`DELETE FROM visitor WHERE timestamp_last <= ?`, [conc]);
    conc = new Date(now - 100 * 60 * 1000);
    await DB.query(`DELETE FROM visitor_dynamic WHERE timestamp <= ?`, [conc]);
  });
};

createCronTask(interval);

module.exports = {
  createCronTask,
  setInterval: (newInterval) => {
    interval = newInterval;
    createCronTask(interval);
  },
};

if (process.env.NODE_ENV === "prod") {
  app.use("/", express.static(path.join(__dirname, "..", "client", "build")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "..", "client", "build", "index.html")
    );
  });
}

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();

module.exports = task;
