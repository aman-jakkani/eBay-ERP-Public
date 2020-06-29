var mongoose = require('mongoose');
var mongooseUniqueValidator = require('mongoose-unique-validator');

var user_schema = mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  tech_seeded: {type: Boolean, required: true},
  liquidation_seeded: {type: Boolean, required: true},
  refresh_token: {type: String, required: true}
});

user_schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('User', user_schema);
