require("dotenv").config();
require("express-async-errors");

// express
const express = require("express");
const app = express();

// packages
const { StatusCodes } = require("http-status-codes");
const morgan = require("morgan");

// dataBase
const connDb = require("./db/connect");

// routes
const userRoutes = require("./routes/userRoute");

// middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const req = require("express/lib/request");

app.use(express.json());
app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.status(StatusCodes.OK).send("get route");
});

app.use("/api/st/auth", userRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 4000;

const start = async () => {
  try {
    await connDb(process.env.MONGO_URL);
    app.listen(port, () => console.log(`app listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
