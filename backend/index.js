require("dotenv").config();
require("express-async-errors");

//import express
const express = require("express");
const app = express();

//Security
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

//connectDb
const connectDb = require("./db/connect");

//authentication
const authenticatedUser = require("./middleware/authentication");

//routers
const authRouter = require("./routes/auth.js");
const userRouter = require("./routes/user.js");
const bookRouter = require("./routes/books.js");
const movieRouter = require("./routes/movies.js");

//error Handler
const notFoundMiddleware = require("./middleware/not-found.js");
const errorHandlerMiddleware = require("./middleware/error-handler.js");

//extras
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

//routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/book", authenticatedUser, bookRouter);
app.use("/api/v1/movie", authenticatedUser, movieRouter);
app.use("/api/v1/user", authenticatedUser, userRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
