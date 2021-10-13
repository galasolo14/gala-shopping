const express = require('express');
const router = express.Router();
const { addProduct, fetchProducts, updateProduct, fetchCategories } = require('../services/shop');

router.post('/add', async (req, res) => {
    try {
        await addProduct(req.body.product);
        return res.sendStatus(200);
    } catch(err) {
        return res.sendStatus(400);
    }
});

router.get('/category', async (req, res) => {
    try {
        const row = await fetchCategories();
        return res.json({row, user: req.session.passport});
    } catch(err) {
        return res.sendStatus(400);
    }
});

router.get('/:categoryID', async (req, res) => {
    try {
        const row = await fetchProducts(req.params.categoryID);
        return res.json(row);
    } catch(err) {
        return res.sendStatus(400);
    }
});

router.post('/edit', async (req, res) => {
    const {id, product} = req.body;
    try {
        await updateProduct(id, product);
        return res.sendStatus(200);
    } catch(err) {
        return res.sendStatus(400);
    }
});

module.exports = router;