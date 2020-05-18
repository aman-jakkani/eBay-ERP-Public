var mongoose = require('mongoose');
var mongooseUniqueValidator = require('mongoose-unique-validator');

var product_schema = mongoose.Schema({
    title: {type: String, required: true},
    price: [{type: Number, required: false}],
    quantity: [{type: Number, required: true}]
});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Product', product_schema);
