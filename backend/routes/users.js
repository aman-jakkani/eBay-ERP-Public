const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();
const User = require("../models/user");
const checkAuth = require("../middleware/check-auth");


router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash,
      seeded: false
    });
    user.save().then(result =>{
      res.status(201).json({
        message: "User created!",
        result: result
      });
    }).catch(err => {
      res.status(500).json({
        error: err
      })
    })
  });
});

router.post("/seed", checkAuth, (req, res, next) => {
  User.findOneAndUpdate({_id: req.userData.userID}, {"$set":{seeded: true}}).then(user => {
    res.status(200).json({
      message: "User updated!"
    });
  }).catch(err => {
    console.log(err);
    return res.status(401).json({
      message: "Update failed"
    });
  })
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({email: req.body.email}).then(user => {
    if(!user) {
      return res.status(401).json({
        message: "Auth failed, user not found"
      });
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);
  }).then(result => {
    if(!result) {
      return res.status(401).json({
        message: "Auth failed, wrong password"
      });
    }
    const token = jwt.sign({email: fetchedUser.email, userID: fetchedUser._id},
      "this_can_literally_be_anything_lol",
      {expiresIn: "1h"});
    res.status(200).json({
      message: "Auth successful",
      token: token,
      expiresIn: 3600,
      userID: fetchedUser._id
    });
  }).catch(err => {
    console.log(err);
    return res.status(401).json({
      message: "Auth failed"
    });
  });
});
module.exports = router;
