const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://bharath:!4Vishalini@chat-app-mern.1uidr.mongodb.net/chat-app-mern?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("hello World !");
});

const port = 5000;
app.listen(port);
