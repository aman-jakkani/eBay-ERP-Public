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
        message: "This user already exists!",
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


  //USING FOR SEEDDATA TESTING
  const username = prompt('What is your username?');
  const password = prompt('What is your password?');

  	// spawn new child process to call the python script
  const python = spawn('python3', ['../backend/python_scripts/seed_data_liquidation.py',username,password]);
	// collect data from script
	python.stdout.on('data', function (data) {

    pythonData = data;
    console.log(uint8arrayToString(data));
  });


	// in close event we are sure that stream is from child process is closed
	python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
  
    // res.status(200).json({
    //   message: "got link data",
    //   data: JSON.parse(largeDataSet.join(""))
    // });
  });

  var uint8arrayToString = function(data){
    return String.fromCharCode.apply(null, data);
  };

  python.stderr.on('data', (data) => {
    // As said before, convert the Uint8Array to a readable string.
    console.log("stderr");
    console.log(uint8arrayToString(data));
  });
  
  python.on('exit', (code) => {
    console.log("Process quit with code : " + code);
  });

  
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
      userID: fetchedUser._id,
      seeded: fetchedUser.seeded
    });
  }).catch(err => {
    console.log(err);
    return res.status(401).json({
      message: "Invalid Authentication Credentials!"
    });
  });
});
module.exports = router;
