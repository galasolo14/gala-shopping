const mongoose = require('mongoose');
const addItemCartSchema = require('../models/cart.model');
const Item = mongoose.model('Item', addItemCartSchema);

const addItemCart = async (obj, cartId) => {
    const {product_id, quantity, item_price} = obj;
    try {
        const newItem = new Item({ product_id, quantity, item_price,  cart_id: cartId[0]._id });
        return await newItem.save();
    } catch (err) {
        throw err;
    }
}

const fetchCartItems = async (cartID) => {
    try {
        const results = await Item.find({cart_id: cartID}).populate('product_id');
        return (results);
    } catch (err) {
        throw err;
    }
}

const deleteCartItems = async (cartItamId) => {
    try {
        const deleted = await Item.deleteOne({ _id: cartItamId });
        return (deleted);
    } catch (err) {
        throw err;
    }
}

module.exports = { addItemCart, fetchCartItems, deleteCartItems };