const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const querystring = require("querystring");

//const Movie = require("./models/movie");

const Manifest = require("./models/manifest");
const Product = require("./models/product");
const Item = require("./models/item");
const Draft = require("./models/draft");

const userRoutes = require("./routes/users");
const listingRoutes = require("./routes/listing");
const analysisRoutes = require("./routes/analysis");

const Ebay = require('ebay-node-api');

const app = express();
const {spawn} = require('child_process');

mongoose.connect(
    "mongodb+srv://admin:wvpEj5g4AtIaLANt@listing-tool-cluster-rkyd0.mongodb.net/dev_db?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

let ebay = new Ebay({
  clientID: "V4ULLC-Inventor-PRD-c2eba4255-ca5c65cc",
  clientSecret: "PRD-2eba425576de-54b9-4b1c-aee8-51e4",
  body: {
    grant_type: 'client_credentials',
    scope: 'https://api.ebay.com/oauth/api_scope'
  }
});

app.use("/api/users", userRoutes);
app.use("/api/listing", listingRoutes);

app.get("/api/testEbay", (req, res) => {
  ebay.getAccessToken().then((data) => {
    console.log(data); // data.access_token
  }, (error) => {
    console.log(error);
  });
});


module.exports = app;
