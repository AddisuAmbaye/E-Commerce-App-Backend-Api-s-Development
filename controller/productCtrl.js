const product = require('../models/productModel');
const asyncHandler = require('express-async-handler');

// create product
const createProduct = asyncHandler(async (req, res) => {
    const title = req.body.title;
    const productFound = await product.findOne({ title });
    if(!productFound){
        const newProduct = await product.create(req.body);
        res.json(newProduct);
    }
    else{
        throw new Error("Product already exists.");
    }
});

// get all products
const getProducts = asyncHandler(async (req, res) => {
    const products = await product.find();
    res.json(products);
})

module.exports = {createProduct, getProducts};