const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addShoppingCartSchema = new Schema({
    customer_id: String,
    order_open: Boolean
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = addShoppingCartSchema;