var mongoose = require('mongoose');
var mongooseUniqueValidator = require('mongoose-unique-validator');

var draft_schema = mongoose.Schema({
    updated_SKU: {type: Boolean, required: true},
    published_draft: {type: Boolean, required: true},
    listed: {type: Boolean, required: true},
    item_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Item'},
    title: {type: String, required: true},
    condition: {type: String, required: true},
    condition_desc: {type: String, required: true},
    price: {type: Number, required: true}
});

draft_schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Draft', draft_schema);
