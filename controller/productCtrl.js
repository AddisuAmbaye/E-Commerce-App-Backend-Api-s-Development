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
        
        //pagination
        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if(req.query.page){
            const productCount = await product.countDocuments();
            if(skip >= productCount) throw new Error("This page does not exists.");
        }
        const Product = await query;
        res.json(Product);
    }catch(error){ 
        throw new Error(error);
    }
    
}); 

// get product 
const getProduct = asyncHandler(async (req, res) => {
    const id = req.params.id;
    validateMongoDbId(id);
    const getproduct = await product.findById(id);
    if(!getproduct){
        throw new Error("Product does not exist");
    }
    res.json(getproduct);

})

// update product
const updateProduct = asyncHandler( async(req, res) => {
    const id = req.params.id;
    validateMongoDbId(id);
    try{
      if(req.body.title){
            req.body.slug = slugify(req.body.title);
        }  
      const UpdatedProduct = await product.findByIdAndUpdate(id, req.body, { new: true } );
      res.json(UpdatedProduct);
    }
   catch(err){
          throw new Error(err);
   }
});

// delete product
const deleteProduct = asyncHandler(async (req, res) => {
    const id = req.params.id;
    validateMongoDbId(id);
    try {
      const productToDelete = await product.findById(id);
  
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

  const addToWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { prodId } = req.body;
    try {
      const user = await User.findById(_id);
      const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);
      if (alreadyadded) {
        let user = await User.findByIdAndUpdate(
          _id,
          {
            $pull: { wishlist: prodId },
          },
          {
            new: true,
          }
        );
        res.json(user);
      } else {
        let user = await User.findByIdAndUpdate(
          _id,
          {
            $push: { wishlist: prodId },
          },
          {
            new: true,
          }
        );
        res.json(user);
      }
    } catch (error) {
      throw new Error(error);
    }
  });
  
  const rating = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, prodId, comment } = req.body;
    try {
      const product = await Product.findById(prodId);
      let alreadyRated = product.ratings.find(
        (userId) => userId.postedby.toString() === _id.toString()
      );
      if (alreadyRated) {
        const updateRating = await Product.updateOne(
          {
            ratings: { $elemMatch: alreadyRated },
          },
          {
            $set: { "ratings.$.star": star, "ratings.$.comment": comment },
          },
          {
            new: true,
          }
        );
      } else {
        const rateProduct = await Product.findByIdAndUpdate(
          prodId,
          {
            $push: {
              ratings: {
                star: star,
                comment: comment,
                postedby: _id,
              },
            },
          },
          {
            new: true,
          }
        );
      }
      const getallratings = await Product.findById(prodId);
      let totalRating = getallratings.ratings.length;
      let ratingsum = getallratings.ratings
        .map((item) => item.star)
        .reduce((prev, curr) => prev + curr, 0);
      let actualRating = Math.round(ratingsum / totalRating);
      let finalproduct = await Product.findByIdAndUpdate(
        prodId,
        {
          totalrating: actualRating,
        },
        { new: true }
      );
      res.json(finalproduct);
    } catch (error) {
      throw new Error(error);
    }
  });
module.exports = {  
                    createProduct, 
                    getAllProducts,  
                    getProduct,  
                    updateProduct, 
                    deleteProduct,
                    addToWishlist,
                    rating,
                }; 