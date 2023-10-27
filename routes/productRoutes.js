const express = require('express');
const productRouter = express.Router();
const {
     createProduct,
     getAllProducts, 
     getProduct, 
     updateProduct, 
     deleteProduct } = require('../controller/productCtrl');

productRouter.post("/post-product", createProduct);
productRouter.get("/get-all-products", getAllProducts);
productRouter.get("/get-product/:id", getProduct);
productRouter.put("/update-product/:id", updateProduct);
productRouter.delete("/delete-product/:id", deleteProduct);
 
module.exports = productRouter;   