var mongoose = require('mongoose');
var mongooseUniqueValidator = require('mongoose-unique-validator');

var item_schema = mongoose.Schema({
    id: {type: mongoose.Schema.Types.ObjectId, required: true},
    name: {type: String, required: true},
    quantity: {type: Number, required: true},
    price: {type: Number, required: true},
    model: {type: String},
    grade: {type: String},
    product_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
    manifest_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Manifest'}

});

item_schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Item', item_schema);
