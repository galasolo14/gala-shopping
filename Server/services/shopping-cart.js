const mongoose = require('mongoose');
const addShoppingCartSchema = require('../models/shopping-cart.model');
const Cart = mongoose.model('Cart', addShoppingCartSchema);

const addShoppingCart = async (obj) => {
    const {customer_id} = obj;
    try {
        const newShoppingCart = new Cart({ customer_id, order_open: true });
        return await newShoppingCart.save();
    } catch (err) {
        throw err;
    }
}

const fetchCartId = async (customer_id) => {
    try {
        let cartid = await Cart.find({customer_id, order_open: true});
        return cartid;
    } catch (err) {
        throw err;
    }
}

const createNewCart = async (id) => {
    console.log('createNewCart Service');
    try {
        cartid = new Cart({ customer_id:id, order_open: true });
        return await cartid.save();
    } catch (err) {
        throw err;
    }
    
}

const closeCart = async (id) => {
    try {
        const updateCart = await Cart.updateOne( {_id: id} , {order_open: false });
        return updateCart;
    } catch (err) {
        throw err;
    }
}

module.exports = { addShoppingCart, fetchCartId, closeCart, createNewCart };