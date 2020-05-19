var mongoose = require('mongoose');
var mongooseUniqueValidator = require('mongoose-unique-validator');

var manifest_schema = mongoose.Schema({
    manifest_id: {type: mongoose.Schema.Types.ObjectId, required: true},
    products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }],
    auction: {type: String, required: true},
    auction_id: {type: Number},
    date_purchased: {type: Date, required: true}
});

manifest_schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Manifest', manifest_schema);
