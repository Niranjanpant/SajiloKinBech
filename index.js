const dotenv = require("dotenv");
//load environment variables
dotenv.config({ path: "./config/config.env" });
const express = require("express");
require("./db/mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

//require middleware(logger)
const morgan = require("morgan");

//use logger middleware
app.use(morgan("dev"));

//load route files
const userRouter = require("./routes/user");

//Body parser
app.use(express.json());

//mout routers
app.use("/api/v1/user", userRouter);

app.listen(PORT, () => {
  console.log(`server is running wild on ${PORT}`);
});
