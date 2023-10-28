const product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
// create product
const createProduct = asyncHandler(async (req, res) => {
   try{
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        }
       const newProduct = await product.create(req.body);
       res.json(newProduct);    
   }
    catch(err){
        throw new Error("Product already exists.");
    }
});

// get all products

const getAllProducts = asyncHandler(async (req, res) => {
    try{
        //filtering
        const queryObj = {...req.query};
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach((el) => delete queryObj[el]);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        let query = product.find(JSON.parse(queryStr));

        //sorting
        if(req.query.sort){
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);
        }
        else{
            query = query.sort("-createdAt");
        }
        const Product = await query;
        res.json(Product);
    }catch(error){ 
        throw new Error(error)
    }
    
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
    try{
      if(req.body.title){
            req.body.slug = slugify(req.body.title);
        }  
      const UpdatedProduct = await product.findByIdAndUpdate(req.params.id, req.body, { new: true } );
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