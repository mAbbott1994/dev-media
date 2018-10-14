const express = require("express");
const morgan = require("morgan");
const dbKey = require("./config/db/keys");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const userRoute = require("./routes/api/authentication/authentication");
const postsRoute = require("./routes/api/posts/posts");
const profileRoute = require("./routes/api/profile/profile");
const app = express();

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
require("./config/passport/passport")(passport);
app.use("/api/authentication", userRoute);
app.use("/api/posts", postsRoute);
app.use("/api/profile", profileRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
  mongoose.connect(
    dbKey.mongodb.uri,
    { useNewUrlParser: true }
  );
});
