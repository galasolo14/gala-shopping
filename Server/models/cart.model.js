const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addItemCartSchema = new Schema({
    product_id: {type: Schema.Types.ObjectId, ref: 'Product'},
    quantity: Number,
    item_price: Number,
    cart_id: String,
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = addItemCartSchema;