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
  code = req.params.code;
  const headers = {"Content-Type": "application/x-www-form-urlencoded", 'Authorization': 'Basic '+btoa("V4ULLC-Inventor-PRD-c2eba4255-ca5c65cc:PRD-2eba425576de-54b9-4b1c-aee8-51e4")};
  axios.post('https://cors-anywhere.herokuapp.com/'+'https://api.ebay.com/identity/v1/oauth2/token', {
      "grant_type": "authorization_code",
      "code": code,
      "redirect_uri": "V4U_LLC-V4ULLC-Inventor-geqkxzxxi"
    }, {headers: headers}).then(res => {
      console.log(res);
      res.status(200).json({
        message: "User verified successfully",
        response: res
      })
  }).catch(err => {
    res.status(500).json({
      message: "Something went wrong while verifying!"
    });
  })
})
module.exports = router;
