const express = require('express');
const productRouter = express.Router();
const {
     createProduct,
     getAllProducts, 
     getProduct, 
     updateProduct, 
     deleteProduct, 
     addToWishlist,
     rating, } = require('../controller/productCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

productRouter.post("/post-product", authMiddleware, isAdmin, createProduct);
productRouter.get("/get-all-products", getAllProducts);
productRouter.put("/wishlist", authMiddleware, addToWishlist);
productRouter.put("/rating", authMiddleware, rating);
productRouter.get("/get-product/:id", getProduct);
productRouter.put("/update-product/:id", authMiddleware, isAdmin, updateProduct);
productRouter.delete("/delete-product/:id", authMiddleware, isAdmin, deleteProduct);
 
module.exports = productRouter;   