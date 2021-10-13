const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    customer_id: String,
    cart_id: String,
    price: Number,
    delivery_city: String,
    delivery_street: String,
    delivery_date: String,
    payment_4digi: Number,
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = orderSchema;