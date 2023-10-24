const  user = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const generateToken = require('../config/generateToken')

//create user
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
//login
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

  //get all users
  const getAllUsersCtrl = asyncHandler(async (req, res) => {
   try
    {
      const Users = await user.find();
      res.json(Users);
    }
  catch(error){
    throw new Error(error)
   }
  });

//get user by id
const getUserCtrl = asyncHandler(async (req, res) => {
   try{
      const User = await user.findById(req.params.id);
      res.json(User)
   }
   catch(error){
      throw new Error("user not found")
   }
});

//delete user
const deleteUserCtrl = asyncHandler(async (req, res) => {
   try{
      await user.findByIdAndDelete(req.params.id);
      res.json({
         status: "success",
         data: "User deleted successfully",
       });
   }
   catch(error){
      throw new Error("user not found")
   }
});

//update
const userUpdateCtrl = asyncHandler(async (req, res, next) => {
   const { email, lastname, firstname, mobile } = req.body;
   try {
     //Check if email is not taken
     if (email) {
       const emailTaken = await user.findOne({ email });
       if (emailTaken) {
        throw new Error("Email is taken");
       }
     }
 
     //update the user
     const User = await user.findByIdAndUpdate(
       req.params.id,
       {
         firstname,
         lastname,
         email,
         mobile
       },
       {
         new: true,
         runValidators: true,
       }
     );
     //send response
     res.json({
       status: "success",
       data: User,
     });
   } catch (error) {
     throw new Error(error);
   }
 });

module.exports =   {
                     createUserCtrl, 
                     userLoginCtrl,
                     userUpdateCtrl,
                     getAllUsersCtrl, 
                     getUserCtrl,
                     deleteUserCtrl
                    };