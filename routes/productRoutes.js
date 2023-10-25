const express = require('express');
const productRouter = express.router();
const createProduct = require('../controller/productCtrl');

productRouter.post("/post-product", createProduct);

module.exports = productRouter;