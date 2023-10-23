const  user = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const generateToken = require('../config/generateToken')
const createUserCtrl = asyncHandler(
    async (req, res) => {
        const email = req.body.email;
        const UserFound = await user.findOne({email});
        if(!UserFound){
           const newUser = await user.create(req.body);
           res.json(newUser);
          
        }else{ 
           throw new Error('User already exists');
        }       
  });

const userLoginCtrl = asyncHandler(
   async(req, res) => {

      const{email, password} = req.body;
      const userFound = await user.findOne({email});
      if(!userFound){
         res.json({message: "Email not found"});
      }
     
     const isPasswordMatched = await bcrypt.compareSync(password, userFound.password);

    if(isPasswordMatched) { 
      res.json({
      status: "success",
      data: {
        firstname: userFound.firstname,
        lastname: userFound.lastname,
        email: userFound.email,
        mobile: userFound.mobile,
        token: generateToken(userFound._id)
      },
    });
   }
   else{
      throw new Error("Invalid login credentials");
   } 
  });
module.exports = {createUserCtrl, userLoginCtrl};