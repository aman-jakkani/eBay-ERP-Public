const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const querystring = require("querystring");

//const Movie = require("./models/movie");

const Manifest = require("./models/manifest");
const Product = require("./models/product");
const Item = require("./models/item");
const Draft = require("./models/draft");

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
app.get("/api/getLiquidationManifests", (req, res) => {

  var url = req.params.url;
  console.log(req.params);

  Manifest.find({source: "liquidation.com"}).then(documents => {
    console.log(documents);
    res.status(200).json({
      message: "Liquidation Manifests fetched succesfully",
      manifests: documents
    });
  });

});

app.get("/api/getTechManifests", (req, res) => {

  var url = req.params.url;
  console.log(req.params);

  Manifest.find({source: "techliquidators.com"}).then(documents => {
    console.log(documents);
    res.status(200).json({
      message: "Tech Liquidation Manifests fetched succesfully",
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

  var item_id = req.params.itemID;
  console.log(req.params);
  Item.findOne({ _id: item_id }).then(item => {
    var product_id = item.product_id
    Product.findOne({ _id: product_id }).then(document => {
      console.log(document);
      res.status(200).json({
        message: "Product fetched successfully",
        product: document
      });
    });
  });
});

//getting draft of the item
app.get("/api/getDraft/:itemID", (req, res) => {
  var item_id = req.params.itemID;
  console.log(req.params);
  Draft.findOne({item_id: item_id}).then(draft =>{
    console.log(draft);
    res.status(200).json({
      message: "Draft fetched successfully",
      draft: draft
    });
  });
});

//updating sku
app.get("/api/updateSKU/:itemID/:newSKU", (req, res) => {
  var itemID = req.params.itemID;
  var newSKU = req.params.newSKU;
  console.log(req.params);
  Item.findById(itemID).then(item => {
    console.log("found item", item);


    Product.findOne({sku: newSKU}).then(product => {


      if(!product){

        var newProduct = new Product({ sku: newSKU, quantity_sold: 0, prices_sold: []});
        newProduct.save(function(err, prod) {
          if (err) {
            console.error(err,"logging eerror");
          }
        });
        console.log(newProduct._id);
        Item.findOneAndUpdate({_id: itemID}, {product_id: newProduct._id}, {new: true}).then(newitem =>{
          console.log("logging item new",newitem, newProduct);
        });

        res.status(200).json({
          message: "SKU Updated successfully",
          product: newProduct
        });
      }
      else{
        console.log("need to save item",product._id);
        // item.product_id = product._id;
        Item.findOneAndUpdate({_id: itemID}, {product_id: product._id}, {new: true}).then(newitem =>{
          console.log("logging item new",newitem, product);
        });

        res.status(200).json({
          message: "SKU Updated successfully",
          product: product
        });
      }


    });

  });
  Draft.findOneAndUpdate({item_id: itemID}, {updated_SKU: true}, {new: true}).then(newDraft => {
    console.log("draft updated", newDraft);
  });
});


app.get("/api/updateDraft/:draftID/:newTitle/:newCondition/:newDesc/:newPrice", (req, res) => {
  console.log("loggin parameters",req.params);

  var newTitle = req.params.newTitle.split(":")[1];
  var newCondition = req.params.newCondition.split(":")[1];
  var newDesc = req.params.newDesc.split(":")[1];
  var newPrice = req.params.newPrice.split(":")[1];
  // newPrice = parseInt(newPrice);
  var draftID = req.params.draftID.split(":")[1];
  console.log("loggin newTitle"+newPrice);

  Draft.findOneAndUpdate({_id: draftID}, {"$set":{title: newTitle, condition: newCondition, condition_desc: newDesc, price: newPrice, published_draft: true}}, {new: true}).then(draft =>{
    console.log(draft, "updated draft");
    res.status(200).json({
      message: "Draft updated successfully",
      draft: draft
    });
  });
});

app.get("/api/listDraft/:draftID", (req, res) => {
  var draftID = req.params.draftID;
  console.log(req.params);
  Draft.findOneAndUpdate({_id: draftID}, {listed: true}, {new: true}).then(draft => {
    console.log(draft, "listed draft");
    res.status(200).json({
      message: "Draft listed successfully",
      draft: draft
    });
  });
});

app.get("/api/unlistDraft/:draftID", (req, res) => {
  var draftID = req.params.draftID;
  console.log(req.params);
  Draft.findOneAndUpdate({_id: draftID}, {listed: false}, {new: true}).then(draft => {
    console.log(draft, "unlisted draft");
    res.status(200).json({
      message: "Draft unlisted successfully",
      draft: draft
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
