const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();
const User = require("../models/user");
const checkAuth = require("../middleware/check-auth");

const {spawn} = require('child_process');
const prompt = require('prompt-sync')();
const axios = require('axios');
const querystring = require('querystring');

router.get("/ebay/:code", checkAuth, (req, res) => {
  let tcode = req.params.code;
  console.log(req.params);
  let data = "V4ULLC-Inventor-PRD-c2eba4255-ca5c65cc:PRD-2eba425576de-54b9-4b1c-aee8-51e4";
  let buff = new Buffer(data);
  let base64data = buff.toString('base64');
  const headers = {"Content-Type": "application/x-www-form-urlencoded", 'Authorization': 'Basic '+base64data};
  var granttype = querystring.stringify({"grant_type": "authorization_code", "code": tcode, "redirect_uri": "V4U_LLC-V4ULLC-Inventor-geqkxzxxi" });
  axios.post('https://api.ebay.com/identity/v1/oauth2/token',
      granttype
    , {headers: headers}).then(function(response) {
      User.findOneAndUpdate({_id: req.userData.userID}, {refresh_token: response.data.refresh_token}).then(updatedUser => {
        console.log("Updated user's refresh token");
      });
      res.status(200).json({
        message: "User verified successfully",
        data: response.data
      });
  }).catch(err => {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong while verifying!",
      error: err
    });
  })
})

router.get("/refresh", checkAuth, (req, res) => {
  console.log(req.params);
  User.findOne({_id: req.userData.userID}).then(user => {
    let data = "V4ULLC-Inventor-PRD-c2eba4255-ca5c65cc:PRD-2eba425576de-54b9-4b1c-aee8-51e4";
    let buff = new Buffer(data);
    let base64data = buff.toString('base64');
    const headers = {"Content-Type": "application/x-www-form-urlencoded", 'Authorization': 'Basic '+base64data};
    var granttype = querystring.stringify({"grant_type": "refresh_token", "refresh_token": user.refresh_token, "scope": "https://api.ebay.com/oauth/api_scope https://api.ebay.com/oauth/api_scope/sell.marketing.readonly https://api.ebay.com/oauth/api_scope/sell.marketing https://api.ebay.com/oauth/api_scope/sell.inventory.readonly https://api.ebay.com/oauth/api_scope/sell.inventory https://api.ebay.com/oauth/api_scope/sell.account.readonly https://api.ebay.com/oauth/api_scope/sell.account https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly https://api.ebay.com/oauth/api_scope/sell.fulfillment https://api.ebay.com/oauth/api_scope/sell.analytics.readonly https://api.ebay.com/oauth/api_scope/sell.finances https://api.ebay.com/oauth/api_scope/sell.payment.dispute https://api.ebay.com/oauth/api_scope/commerce.identity.readonly" });
    axios.post('https://api.ebay.com/identity/v1/oauth2/token',
        granttype
      , {headers: headers}).then(function(response) {
        res.status(200).json({
          message: "User verified successfully",
          data: response.data
        });
    }).catch(err => {
      console.log(err);
      res.status(500).json({
        message: "Something went wrong while verifying!",
        error: err
      });
    })
  })
})
module.exports = router;

/*
VjRVTExDLUludmVudG9yLVBSRC1jMmViYTQyNTUtY2E1YzY1Y2M6UFJELTJlYmE0MjU1NzZkZS01NGI5LTRiMWMtYWVlOC01MWU0

curl -X POST 'https://api.sandbox.ebay.com/identity/v1/oauth2/token' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -H 'Authorization: Basic VjRVTExDLUludmVudG9yLVBSRC1jMmViYTQyNTUtY2E1YzY1Y2M6UFJELTJlYmE0MjU1NzZkZS01NGI5LTRiMWMtYWVlOC01MWU0' \
  -d 'grant_type=authorization_code&
      code=v^1.1#i^1#I^3#r^1#p^3#f^0#t^Ul41XzQ6OEUxMTJCMkRCNzJFRUUxNTAxOTQwMDBGOUM0MUNCMTNfMF8xI0VeMjYw&
      redirect_uri=V4U_LLC-V4ULLC-Inventor-geqkxzxxi'
  */
