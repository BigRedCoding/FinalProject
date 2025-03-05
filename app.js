require("dotenv").config();

const cors = require("cors");

const path = require("path");

const express = require("express");

process.env = require("dotenv").config();

const mongoose = require("mongoose");

const { PORT = 3001 } = process.env;

const app = express();

const { errors } = require("celebrate");

const errorHandler = require("./middlewares/error-handler");

const { requestLogger, errorLogger } = require("./middlewares/logger");

const { ServerError } = require("./utils/errors");

const mainRouter = require("./routes/index");

// const corsOptions = {
//   origin: "https://api.newsexplorer.justlearning.net",
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTION"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// };

// app.use(cors(corsOptions));

app.use(cors());
app.use(requestLogger);

mongoose.connect("mongodb://127.0.0.1:27017/NewsExplorer_db").catch(() => {
  throw new ServerError();
});

app.use(express.json());

app.use("/", mainRouter);

app.listen(PORT);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);
