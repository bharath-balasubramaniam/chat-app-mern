const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const { User } = require("./models/user");
const { auth } = require("./middleware/auth");
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

app.get("/user/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req.id,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
  });
});
app.post("/user/register", (req, res) => {
  const user = new User(req.body);
  user.save((err, userData) => {
    if (err) return res.json({ success: false, err });
  });
  return res.status(200).json({ success: true });
});
app.post("/user/login", (req, res) => {
  //find  theemail
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "Auth failed email not found",
      });
    }
    //compare the password
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({
          loginSuccess: false,
          message: "Wrong Password",
        });
      }
    });
    //generate token
    user.generateToken((err, user) => {
      if (err) return res.status(400).send(err);
      res.cookie("x_auth", user.token).status(200).json({ loginSuccess: true });
    });
  });
});
app.get("/user/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({ success: true });
  });
});
const port = 5000;
app.listen(port);
