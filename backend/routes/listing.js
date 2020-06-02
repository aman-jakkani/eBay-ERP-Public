const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();
const User = require("../models/user");
const Manifest = require("../models/manifest");
const Product = require("../models/product");
const Item = require("../models/item");
const Draft = require("../models/draft");
const checkAuth = require("../middleware/check-auth");

//getting all manifests from database
router.get("/getLiquidationManifests", checkAuth, (req, res) => {

  var url = req.params.url;
  console.log(req.params);

  Manifest.find({source: "liquidation.com"}).then(documents => {
    console.log(documents);
    res.status(200).json({
      message: "Liquidation Manifests fetched succesfully",
      manifests: documents
    });
  }).catch(err => {
    res.status(500).json({
      message: "Liquidation manifests couldn't be fetched!"
    });
  })

});

router.get("/getTechManifests", checkAuth, (req, res) => {

  var url = req.params.url;
  console.log(req.params);

  Manifest.find({source: "techliquidators.com"}).then(documents => {
    console.log(documents);
    res.status(200).json({
      message: "Tech Liquidation Manifests fetched succesfully",
      manifests: documents
    });
  }).catch(err => {
    res.status(500).json({
      message: "Tech Liquidator manifests couldn't be fetched!"
    });
  })

});

//getting a specific manifest
router.get("/getManifest/:manifestID", checkAuth, (req, res) => {

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
router.get("/getItems/:manifestID", checkAuth, (req, res) => {

  var url = req.params.url;
  var manifest_id = req.params.manifestID;
  console.log(req.params);

  Item.find({manifest_id: manifest_id}).then(documents => {
    console.log(documents);
    res.status(200).json({
      message: "Items fetched succesfully",
      items: documents
    });
  }).catch(err => {
    res.status(500).json({
      message: "Something went wrong while fetching items!"
    });
  })

});

//getting the product model of the item
router.get("/getProduct/:itemID", checkAuth, (req, res) => {

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
  }).catch(err => {
    res.status(500).json({
      message: "Product wasn't retrieved for the item!"
    });
  })
});

//getting draft of the item
router.get("/getDraft/:itemID", checkAuth, (req, res) => {
  var item_id = req.params.itemID;
  console.log(req.params);
  Draft.findOne({item_id: item_id}).then(draft =>{
    console.log(draft);
    res.status(200).json({
      message: "Draft fetched successfully",
      draft: draft
    });
  }).catch(err => {
    res.status(500).json({
      message: "Could not get the draft of the item!"
    });
  })
});

//updating sku
router.get("/updateSKU/:itemID/:newSKU", checkAuth,  (req, res) => {
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


    }).catch(err => {
      res.status(500).json({
        message: "SKU wasn't updated successfully!"
      });
    })

  });
  Draft.findOneAndUpdate({item_id: itemID}, {updated_SKU: true}, {new: true}).then(newDraft => {
    console.log("draft updated", newDraft);
  }).catch(err => {
    res.status(500).json({
      message: "Draft wasn't updated successfully!"
    });
  })
});

//updating the draft
router.get("/updateDraft/:draftID/:newTitle/:newCondition/:newDesc/:newPrice", checkAuth, (req, res) => {
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
  }).catch(err => {
    res.status(500).json({
      message: "Draft wasn't updated successfully!"
    });
  })
});

router.get("/listDraft/:draftID", checkAuth, (req, res) => {
  var draftID = req.params.draftID;
  console.log(req.params);
  Draft.findOneAndUpdate({_id: draftID}, {listed: true}, {new: true}).then(draft => {
    console.log(draft, "listed draft");
    res.status(200).json({
      message: "Draft listed successfully",
      draft: draft
    });
  }).catch(err => {
    res.status(500).json({
      message: "Draft wasn't updated successfully!"
    });
  })
});

router.get("/unlistDraft/:draftID", checkAuth, (req, res) => {
  var draftID = req.params.draftID;
  console.log(req.params);
  Draft.findOneAndUpdate({_id: draftID}, {listed: false}, {new: true}).then(draft => {
    console.log(draft, "unlisted draft");
    res.status(200).json({
      message: "Draft unlisted successfully",
      draft: draft
    });
  }).catch(err => {
    res.status(500).json({
      message: "Draft wasn't updated successfully!"
    });
  })
});



//Getting auction data from liquidation
router.get("/getLinkData/:url/:siteNum", (req, res) => {



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

module.exports = router;
