var mongoose = require('mongoose');
var OrderEntry = require('./OrderEntry.js')

var OrderSchema = new mongoose.Schema({
    items: [OrderEntry.schema],
    date: Date,
    closed: {type: Boolean, default: false}
});

module.exports = mongoose.model('Order', OrderSchema);
