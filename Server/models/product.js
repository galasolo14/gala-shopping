const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: String,
    category: String,
    price: Number,
    priceOption: String,
    picture: String,
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const categorySchema = new Schema({
    name: String,
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = {productSchema, categorySchema} ;