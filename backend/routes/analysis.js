const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();
const User = require("../models/user");
const checkAuth = require("../middleware/check-auth");

const {spawn} = require('child_process');
const prompt = require('prompt-sync')();
const axios = require('axios');

router.get("/ebay/:code", checkAuth, (req, res) => {
  let tcode = req.params.code;
  console.log(req.params);
  let data = "V4ULLC-Inventor-PRD-c2eba4255-ca5c65cc:PRD-2eba425576de-54b9-4b1c-aee8-51e4";
  let buff = new Buffer(data);
  let base64data = buff.toString('base64');
  const headers = {"Content-Type": "application/x-www-form-urlencoded", 'Authorization': 'Basic '+base64data};
  axios.post('https://cors-anywhere.herokuapp.com/'+'https://api.ebay.com/identity/v1/oauth2/token', {
      "grant_type": "authorization_code",
      "code": tcode,
      "redirect_uri": "V4U_LLC-V4ULLC-Inventor-geqkxzxxi"
    }, {headers: headers}).then(data => {
      console.log(res);
      res.status(200).json({
        message: "User verified successfully",
        response: data
      })
  }).catch(err => {
    res.status(500).json({
      message: "Something went wrong while verifying!"
    });
  })
})
module.exports = router;
