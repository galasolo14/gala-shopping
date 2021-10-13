const mongoose = require('mongoose');
const orderSchema = require('../models/order.model');
const Order = mongoose.model('Order', orderSchema);

const addOrder = async (obj) => {
    const {customer_id, cart_id, price, delivery_city, delivery_street, delivery_date, payment_4digi} = obj;
    try {
        const newSOrder = new Order({ customer_id, cart_id, price, delivery_city, delivery_street, delivery_date, payment_4digi });
        return await newSOrder.save();
    } catch (err) {
        throw err;
    }
}

const checkDate = async (date) => {
    try {
        const results = await Order.find({delivery_date: date});
        return results;
    } catch (err) {
        throw err;
    }
}

const orderSum = async () => {
    try {
        const result = await Order.count();
        return result;
    } catch (err) {
        throw err;
    }
}

const fetchOrder = async (id) => {
    try {
        const result = await Order.find({customer_id: id});
        return result;
    } catch (err) {
        throw err;
    }
}

module.exports = { addOrder, checkDate, orderSum, fetchOrder };