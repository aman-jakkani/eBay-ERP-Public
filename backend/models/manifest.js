var mongoose = require('mongoose');
var mongooseUniqueValidator = require('mongoose-unique-validator');

var manifest_schema = mongoose.Schema({
    manifest_id: {type: mongoose.Schema.Types.ObjectId, required: true},
    auction: {type: String, required: true},
    auction_id: {type: Number},
    transaction_id: {type: Number},
    quantity: {type: Number},
    total_price: {type: Float32Array, required: true},
    date_purchased: {type: Date, required: true},
    status: {type: String},
    products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }],
});

manifest_schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Manifest', manifest_schema);
