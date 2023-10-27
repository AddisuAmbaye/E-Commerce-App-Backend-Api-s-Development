const express = require('express');
const productRouter = express.Router();
const {createProduct, getAllProducts, getProduct} = require('../controller/productCtrl');

productRouter.post("/post-product", createProduct);
productRouter.get("/get-all-products", getAllProducts);
productRouter.get("/product/:id", getProduct);

module.exports = productRouter;