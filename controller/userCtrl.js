const  user = require('../models/userModel');

const createUser = async (req, res) => {
      const email = req.body.email;
      const findUser = await user.findOne({email});
      if(!findUser){
         const newUser = await user.create(req.body);
         res.json(newUser);
        
      }
      else{
        res.json({
            message: "user already exists",
            sucess: false
      }); 
      }
};

module.exports = createUser;