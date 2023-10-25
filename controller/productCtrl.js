const Product = require('../models/productModel');

const createProduct = asyncHndler(async (req, res) => {
    const title = req.body.title;
    const productFound = await Product.findOne({ title });
    if(!productFound){
        const newProduct = new product.create(req.body);
        res.json(newProduct);
    }
    else{
        throw new Error("Product already exists.");
    }
})

module.exports = createProduct;