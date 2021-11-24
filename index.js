const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const { User } = require("./models/user");
const config = require("./config/key");
mongoose
  .connect(config.mongoURL, {
    useNewUrlParser: true,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.post("/user/register", (req, res) => {
  console.log("hii");
  const user = new User(req.body);
  console.log(user);
  user.save((err, userData) => {
    if (err) return res.json({ success: false, err });
  });
  return res.status(200).json({ success: true });
});

app.get("/", (req, res) => {
  res.send("hello World !!!");
});

const port = 5000;
app.listen(port);
