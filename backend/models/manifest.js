var mongoose = require('mongoose');
var mongooseUniqueValidator = require('mongoose-unique-validator');

var manifest_schema = mongoose.Schema({
    id: {type: String, required: true},
    products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }]
});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Manifest', manifest_schema);
