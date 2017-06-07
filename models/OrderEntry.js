var mongoose = require('mongoose');
var User = require('./User.js');

var OrderEntrySchema = new mongoose.Schema({
    user: User.schema,
    veggie: {type: Boolean, default: false},
    eggs: {type: Boolean, default: false},
    beef: {type: Boolean, default: true},
    drink: {type: Boolean, default: true},
});

module.exports = mongoose.model('OrderEntry', OrderEntrySchema);
