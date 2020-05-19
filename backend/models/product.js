var mongoose = require('mongoose');
var mongooseUniqueValidator = require('mongoose-unique-validator');

var product_schema = mongoose.Schema({
    product_id: {type: mongoose.Schema.Types.ObjectId, required: true},
    title: {type: String, required: true},
    quantity: [{type: Number, required: true}],
    price: [{type: Float32Array, required: true}],
    model: [{type: String}],
    grade: [{type: String}],
    listing_id: [{type: Number, required: false}],
    manifest_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Manifest'}

});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Product', product_schema);
