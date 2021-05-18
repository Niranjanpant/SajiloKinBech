const dotenv = require("dotenv");
//load environment variables
dotenv.config({ path: "./config/config.env" });
const express = require("express");
const path = require("path");
const fileupload = require("express-fileupload");
require("./db/mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

//require middleware(logger)
const morgan = require("morgan");

//use logger middleware
app.use(morgan("dev"));

//load route files
const userRouter = require("./routes/user");
const propertyRouter = require("./routes/property");

//fileupload middleware
app.use(
  fileupload({
    limits: {
      files: 1,
    },
  })
);

//set statsic foloder
app.use(express.static(path.join(__dirname, "public")));
//Body parser
app.use(express.json());

//mout routers
app.use("/api/v1/userAuth", userRouter);
app.use("/api/v1/property", propertyRouter);

app.listen(PORT, () => {
  console.log(`server is running wild on ${PORT}`);
});
