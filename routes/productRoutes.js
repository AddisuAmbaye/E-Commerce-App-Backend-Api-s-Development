const express = require('express');
const productRouter = express.Router();
const {createProduct, getProducts} = require('../controller/productCtrl');

productRouter.post("/post-product", createProduct);
productRouter.get("/get-product", getProducts);
module.exports = productRouter;