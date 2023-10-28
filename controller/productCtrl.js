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
        throw new Error(err);
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

        // limiting
        if(req.query.fields){
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);  
        }
        else{
            query = query.select("-__v");
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

// delete product

const deleteProduct = asyncHandler(async (req, res) => {
    try {
      const productToDelete = await product.findById(req.params.id);
  
      if (!productToDelete) {
        return res.status(404).json({
          status: "error",
          message: "Product not found",
        });
      }
  
      await product.findByIdAndDelete(req.params.id);
  
      res.json({
        status: "success",
        message: "Product deleted successfully",
      });
    } catch (error) {
      throw new Error("Failed to delete product");
    }
  });
module.exports = {  
                    createProduct, 
                    getAllProducts,  
                    getProduct,  
                    updateProduct, 
                    deleteProduct
                }; 