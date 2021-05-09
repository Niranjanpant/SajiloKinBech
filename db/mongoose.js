const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/sajiloKinBech-api", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`connected to the database ${mongoose.connection.host}`);
  })
  .catch((e) => {
    console.log(e);
  });
