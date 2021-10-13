const express = require('express');
const router = express.Router();
const { addOrder, checkDate } = require('../services/order');
const { closeCart } = require('../services/shopping-cart');

router.get('/checkDate/:date', async (req, res) => {
    try {
        const orders = await checkDate(req.params.date);
        return res.json(orders);;
    } catch(err) {
        return res.sendStatus(400);
    }
});

router.post('/addOrder/', async (req, res) => {
    const { obj } = req.body;
    try {
        await addOrder(obj);
        await closeCart(obj.cart_id);
        return res.sendStatus(200);
    } catch(err) {
        return res.sendStatus(400);
    }
});

module.exports = router;