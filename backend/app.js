const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//const Movie = require("./models/movie");

const Manifest = require("./models/manifest");
const Product = require("./models/product");
const Item = require("./models/item");

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
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});


//getting all manifests from database
app.get("/api/getManifests", (req, res) => {

  var url = req.params.url;
  console.log(req.params);

  Manifest.find().then(documents => {
    console.log(documents);
    res.status(200).json({
      message: "Manifests fetched succesfully",
      manifests: documents
    });
  });


});

//getting a specific manifest
app.get("/api/getManifest/:manifestID", (req, res) => {

  var url = req.params.url;
  var manifest_id = req.params.manifestID;
  console.log(req.params);

  Manifest.findOne({_id: manifest_id}).then(document => {
    console.log(document);
    res.status(200).json({
      message: "Manifest fetched succesfully",
      manifest: document
    });
  });

});

//getting items of a manifest
app.get("/api/getItems/:manifestID", (req, res) => {

  var url = req.params.url;
  var manifest_id = req.params.manifestID;
  console.log(req.params);

  Item.find({manifest_id: manifest_id}).then(documents => {
    console.log(documents);
    res.status(200).json({
      message: "Items fetched succesfully",
      items: documents
    });
  });

});

//getting the product model of the item
app.get("/api/getProduct/:itemID", (req, res) => {

  var url = req.params.url;
  var item_id = req.params.itemID;
  console.log(req.params);
  Item.find({id: item_id}).then(item => {
    Product.findOne({id: item.product_id}).then(document => {
      console.log(document);
      res.status(200).json({
        message: "Product fetched successfully",
        product: document
      });
    });
  });

});







//Getting auction data from liquidation
app.get("/api/getLinkData/:url/:siteNum", (req, res) => {



  var url = req.params.url;
  var siteNum = req.params.siteNum;
  console.log(req.params)


  var largeDataSet = [];

	// spawn new child process to call the python script
	const python = spawn('python3', ["-u",'script3.py',url,siteNum]);
	// collect data from script
	python.stdout.on('data', function (data) {

    pythonData = data;


    largeDataSet.push(data.toString());

  });


	// in close event we are sure that stream is from child process is closed
	python.on('close', (code) => {
  console.log(`child process close all stdio with code ${code}`);

    console.log(largeDataSet.join(""));
    res.status(200).json({
      message: "got link data",
      data: JSON.parse(largeDataSet.join(""))
    });
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


module.exports = app;
