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
const getAllProducts = asyncHandler(async (req, res) => {
    const products = await product.find();
    res.json(products);
});

// get product 
const getProduct = asyncHandler(async (req, res) => {
    const getproduct = await product.findById(req.params.id);
    if(!getproduct){
        throw new Error("Product does not exist");
    }
    res.json(getproduct);

})

// update product
const updateProduct = asyncHandler( async(req, res) => {
    const product = req.body;
    try{
      const UpdatedProduct = await product.findByIdAndUpdate(
            req.params.id, 
            {
            product
            },
            {
            new: true
            });
            res.json(UpdatedProduct);
    }
   catch(err){
          throw new Error(err);
   }
});

// delete user

const deleteProduct = asyncHandler( async(req, res) => {
    try{
         await product.findByIdAndDelete(req.params.id);
         res.json({
            status: "success",
            data: "User deleted successfully",
          });
        }
   catch(err){
        throw new Error("Product not found");
   }
});
module.exports = {  
                    createProduct, 
                    getAllProducts,  
                    getProduct,  
                    updateProduct, 
                    deleteProduct
                }; 