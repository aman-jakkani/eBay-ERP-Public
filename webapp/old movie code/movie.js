var mongoose = require('mongoose');
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = mongoose.Schema({
    date: {type: Date, required: false},
    source: {type: String, required: false},
    movieInformation: {type: Object, required: false},
    title: {type: String, required: false},
    altLinks: [{type: String, required: false}],
    image: {type:Buffer, required:false},
});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Movie', schema);
