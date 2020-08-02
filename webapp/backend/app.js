const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const querystring = require("querystring");
const axios = require("axios");

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
    "mongodb+srv://admin:wvpEj5g4AtIaLANt@listing-tool-cluster-rkyd0.mongodb.net/test_db?retryWrites=true&w=majority"
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

app.use("/api/users", userRoutes);
app.use("/api/listing", listingRoutes);


app.get("api/test", (req, res) => {
  axios.get("https://auth.ebay.com/oauth2/authorize?client_id=V4ULLC-Inventor-PRD-c2eba4255-ca5c65cc&response_type=code&redirect_uri=V4U_LLC-V4ULLC-Inventor-geqkxzxxi&scope=https://api.ebay.com/oauth/api_scope").then(res =>{
    console.log(res);
  })
})

module.exports = app;
