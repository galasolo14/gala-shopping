const express = require('express');
const router = express.Router();
const { addItemCart, fetchCartItems, deleteCartItems} = require('../services/cart_item');
const { fetchCartId, createNewCart } = require('../services/shopping-cart');
const { fetchOrder } = require ('../services/order');

router.get('/getCartId', async (req, res) => {
    const {_id} = req.session.passport.user;
    try {
        const cart = await fetchCartId(_id);
        const order = await fetchOrder(_id);
        if(order.length == 0){
            return res.json({cart, 'orderLast': order});
        }
       else{
        return res.json({cart, 'orderLast': order[order.length-1]});
       }
    } catch(err) {
        return res.sendStatus(400);
    }
});

router.get('/newCartId', async (req, res) => {
    const {_id} = req.session.passport.user;
    try {
        const cart_id = await createNewCart(_id);
        return res.json(cart_id);
    } catch(err) {
        return res.sendStatus(400);
    }
});

router.delete('/delete/:cartItemId', async (req, res) => {
    try {
        const row = await deleteCartItems(req.params.cartItemId);
        return res.json(row);
    } catch(err) {
        return res.sendStatus(400);
    }
});

router.post('/addItem', async (req, res) => {
    const {_id} = req.session.passport.user;
    try {
        const cartId = await fetchCartId(_id);
        await addItemCart(req.body, cartId);
        return res.sendStatus(200);
    } catch(err) {
        return res.sendStatus(400);
    }
});

router.get('/getCartItems/:cartId', async (req, res) => {
    try {
        const row = await fetchCartItems(req.params.cartId);
        return res.json({row});
    } catch(err) {
        return res.sendStatus(400);
    }
});














module.exports = router;