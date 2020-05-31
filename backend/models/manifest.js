var mongoose = require('mongoose');
var mongooseUniqueValidator = require('mongoose-unique-validator');

var manifest_schema = mongoose.Schema({
    manifest_id: {type: mongoose.Schema.Types.ObjectId, required: true},
    auction_title: {type: String, required: true},
    auction_id: {type: Number},
    transaction_id: {type: Number},
    quantity: {type: Number},
    total_price: {type: Number, required: true},
    date_purchased: {type: Date, required: true},
    status: {type: String},
    source: {type: String},
    products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }],
    creator: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'}
});

manifest_schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Manifest', manifest_schema);
