const dotenv = require("dotenv");
//load environment variables
dotenv.config({ path: "./config/config.env" });
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server is running wild on ${PORT}`);
});
