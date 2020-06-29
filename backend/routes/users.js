const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();
const User = require("../models/user");
const checkAuth = require("../middleware/check-auth");

const {spawn} = require('child_process');
const prompt = require('prompt-sync')();


router.post("/updateData/:source", checkAuth, (req, res, next) => {

<<<<<<< HEAD
  userId = req.userData.userID;
  const source = req.params.source;

  const username = req.body.username;
  const password = req.body.password;

  // spawn new child process to call the python script
  var fileName;
  if (source === 'liquidation'){
    fileName = 'seed_data_liquidation.py'
  } else if (source === 'techliquidators'){
    fileName = 'seed_data_tech.py'
  } else {
    res.status(400).json({
      message: "Error source not found"
    });
  }
  console.log("Spawning python script ", fileName  )
  const python = spawn('python2', [('./python_scripts/' + fileName), username, password, userId]);

  // collect data from script
  python.stdout.on('data', function (data) {

    pythonData = uint8arrayToString(data);
    console.log("got python data");

    //Checks if use was able to log in
    if ( pythonData.includes("Failed to sign in")){

      res.status(400).json({
        message: "Could not log in try again.",
        seeded: false

      });
    }
    console.log(typeof(pythonData), pythonData.length );
    console.log(pythonData);
  });


  // in close event we are sure that stream is from child process is closed
  python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);

    //Checks if response has already been sent (means that there was problem with log in)
    if ( res.headersSent != true){
      res.status(200).json({
        message: "Success!",
        seeded: true
      });
    }

  });

  var uint8arrayToString = function(data){
    return String.fromCharCode.apply(null, data);
  };

  python.stderr.on('data', (data) => {
    // As said before, convert the Uint8Array to a readable string.
    console.log("stderr");
    console.log(uint8arrayToString(data));
    if ( res.headersSent != true){
      res.status(400).json({
        message: "Could not log in. Error.",
        seeded: false
      });
    }

  });

  python.on('exit', (code) => {
    console.log("Process quit with code : " + code);
  });
=======
 
>>>>>>> 44845926ca5f6b8c194c5640980898315b212686

});

router.post("/seed/:source", checkAuth, (req, res, next) => {
  userId = req.userData.userID;
  const source = req.params.source;

  const username = req.body.username;
  const password = req.body.password;

  // spawn new child process to call the python script
  var fileName;
  if (source === 'liquidation'){
    fileName = 'seed_data_liquidation.py'
  } else if (source === 'techliquidators'){
    fileName = 'seed_data_tech.py'
  } else {
    res.status(400).json({
      message: "Error source not found"
    });
  }
  console.log("Spawning python script ", fileName  )
  const python = spawn('python2', [('./python_scripts/' + fileName), username, password, userId]);

  // collect data from script
  python.stdout.on('data', function (data) {

    pythonData = uint8arrayToString(data);
    console.log("got python data");

    //Checks if use was able to log in
    if ( pythonData.includes("Failed to sign in")){

      res.status(400).json({
        message: "Could not log in try again.",
      });
    }
    console.log(typeof(pythonData), pythonData.length );
    console.log(pythonData);
  });


  // in close event we are sure that stream is from child process is closed
  python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);

    //Checks if response has already been sent (means that there was problem with log in)
    if ( res.headersSent != true){

      if (source === 'techliquidators') {
        // Set User to Seeded
        User.findOneAndUpdate({_id: req.userData.userID}, {"$set":{tech_seeded: true}}).then(user => {
          // Response
          res.status(200).json({
            message: "Success!",
            seeded: true
          });
        });
      } else {
        // Set User to Seeded
        User.findOneAndUpdate({_id: req.userData.userID}, {"$set":{liquidation_seeded: true}}).then(user => {
          // Response
          res.status(200).json({
            message: "Success!",
            seeded: true
          });
        });

      }
      


    }

  });

  var uint8arrayToString = function(data){
    return String.fromCharCode.apply(null, data);
  };

  python.stderr.on('data', (data) => {
    // As said before, convert the Uint8Array to a readable string.
    console.log("stderr");
    console.log(uint8arrayToString(data));
    if ( res.headersSent != true){
      res.status(400).json({
        message: "Could not log in. Error.",
        seeded: false
      });
    }

  });

  python.on('exit', (code) => {
    console.log("Process quit with code : " + code);
  });








});

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash,
      tech_seeded: false,
      liquidation_seeded: false
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

router.get("/techSeeded",checkAuth, (req, res, next) => {
  User.findOne( {_id: req.userData.userID}).then(user => {
    if(!user) {
      res.status(401).json({
        message: "Auth failed, user not found"
      });
    } else {

      res.status(200).json({
        seeded: user.tech_seeded
      })
    }
  })
});

router.get("/liquidationSeeded",checkAuth, (req, res, next) => {
  User.findOne( {_id: req.userData.userID}).then(user => {
    if(!user) {
      res.status(401).json({
        message: "Auth failed, user not found"
      });
    } else {

      res.status(200).json({
        seeded: user.liquidation_seeded
      })
    }
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
      userID: fetchedUser._id,
    });
  }).catch(err => {
    console.log(err);
    return res.status(401).json({
      message: "Invalid Authentication Credentials!"
    });
  });
});
module.exports = router;
