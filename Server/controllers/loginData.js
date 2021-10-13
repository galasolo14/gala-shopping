const express = require('express');
const router = express.Router();
const { productSum } = require('../services/shop');
const { orderSum } = require('../services/order');

router.get('/shopData/', async (req, res) => {
    try {
        const productCount = await productSum();
        const orderCount = await orderSum();
        return res.json({'productCount': productCount, 'orderCount': orderCount});
    } catch(err) {
        return res.sendStatus(400);
    }
});

module.exports = router;