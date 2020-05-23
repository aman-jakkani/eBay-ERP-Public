var mongoose = require('mongoose');
var mongooseUniqueValidator = require('mongoose-unique-validator');

var product_schema = mongoose.Schema({
    id: {type: mongoose.Schema.Types.ObjectId, required: true},
    sku: {type: String, required: true},
    quantity_sold: {type: Number, required: true},
    prices_sold: [{type: Number, required: true}],
    item_ids: [{type: mongoose.Schema.Types.ObjectId, ref: 'Item'}]
});

product_schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Product', product_schema);
