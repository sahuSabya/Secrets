//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
mongoose.set("strictQuery", true);

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    const newUser = new User({
      email: req.body.username,
      password: hash
    });
    newUser.save(function(err) {
      if (!err) {
        res.render("secrets");
      } else {
        console.log(err);
      }
    });
  });
});

app.post("/login", function(req, res) {
  User.findOne({
    email: req.body.username
  }, function(err, doc) {
    if (!err) {
      if (doc) {
        bcrypt.compare(req.body.password, doc.password, function(err, result) {
          // result == true
          if (!err && result) {
            res.render("secrets");
          } else if (!err && !result) {
            res.redirect("/");
          } else {
            console.log(err);
          }
        });

      } else {
        res.redirect("/");
      }
    } else {
      console.log(err);
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
