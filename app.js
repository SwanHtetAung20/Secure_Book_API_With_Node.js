const express = require("express");
require("dotenv").config();
require("express-async-errors");
const connectDB = require("./db/connect");
const createCustomError = require("./middleware/errorHandler");
const authRouter = require("./routes/auth");
const bookRouter = require("./routes/book");
const authorizedRequest = require("./middleware/auth");
const helmet = require("helmet");
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
});

app.set("trust proxy", 1);
app.use(limiter);
app.use(express.json());
app.use(helmet());
app.use(cors());

// * routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/book", authorizedRequest, bookRouter);

// * middleware
app.use(createCustomError);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
