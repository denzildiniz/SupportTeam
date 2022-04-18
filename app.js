require('dotenv').config();
require('express-async-errors')

// express 
const express = require('express');
const app = express();

// packages 
const { StatusCodes } = require('http-status-codes');

// dataBase 
const connDb = require('./db/connect')

// middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json())

app.get("/", (req, res) => {
  res.status(StatusCodes.OK).send("get route");
});

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