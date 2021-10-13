const mongoose = require('mongoose');
const {productSchema, categorySchema} = require('../models/product');
const Product = mongoose.model('Product', productSchema);
const Category = mongoose.model('Category', categorySchema);

const addProduct = async (obj) => {
    const {name, category, price, picture , priceOption} = obj;
    try {
        const newProduct = new Product({ name, category, price,  picture , priceOption });
        return await newProduct.save();
    } catch (err) {
        throw err;
    }
}

const fetchProducts = async (categoryID) => {
    try {
        const results = await Product.find({category: categoryID});
        return (results);
    } catch (err) {
        throw err;
    }
}

const fetchCategories = async () => {
    try {
        const results = await Category.find({});
        return (results);
    } catch (err) {
        throw err;
    }
}

const updateProduct = async (id, product) => {
    const {name, category, price, picture , priceOption} = product;
    try{
        const done = await Product.updateOne({ _id: id }, { name, category, price,  picture , priceOption });
        return (done);
    }
    catch (err) {
        throw err;
    }
}

const productSum = async () => {
    try{
        const products = await Product.count();
        return (products);
    }
    catch (err) {
        throw err;
    }
}

module.exports = { addProduct, fetchProducts, updateProduct, fetchCategories, productSum };