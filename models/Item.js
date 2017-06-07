var mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
    nome: String,
    preco: Number,
});

module.exports = mongoose.model('Item', ItemSchema);
