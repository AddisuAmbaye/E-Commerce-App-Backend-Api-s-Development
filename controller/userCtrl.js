const user = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const generateToken = require('../config/generateToken');
const generateRefershToken = require('../config/refreshToken');
const cookie = require('cookie-parser');
const jwt = require('jsonwebtoken');

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
      const refreshToken = await generateRefershToken(userFound.id);
      await user.findByIdAndUpdate(
        userFound.id,
         {
          refreshToken: refreshToken
         },
         {
          new: true
         });
       res.cookie('refreshToken', refreshToken, { 
          maxAge: 72 * 60 * 60 * 1000, // Cookie expiration time in milliseconds (e.g., 3 days)
          secure: true, 
          httpOnly: true, 
        });
      res.json({
      status: "success",
      data: { 
        firstname: userFound.firstname,
        lastname: userFound.lastname,
        email: userFound.email,
        mobile: userFound.mobile,
        token: generateToken(userFound.id)
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
       req.user._id,
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

//  block user
const blockUser = asyncHandler(async(req, res) =>{

    try {
       await user.findByIdAndUpdate(req.params.id, 
        {
          isBlocked: true
       },
       {
        new: true
       });
       
    } catch (error) {
        throw new Error(error);
    }  
    res.json({
      message:"User Blocked"
    });
  });


// unblock user
const unblockUser = asyncHandler(async(req, res) =>{
  try {
     await user.findByIdAndUpdate(req.params.id, 
     {
       isBlocked: false
    },
    {
     new: true
    });
    
 } catch (error) {
     throw new Error(error);
 } 
 res.json({
  message: "User UnBlocked" 
 }) 
});

//refresh token handler
const refreshTokenHandler = asyncHandler( async (req, res) => {
    const cookie = req.cookies;
    if(!cookie.refreshToken) throw new Error(" No Refresh token");
    const refreshToken = cookie.refreshToken;
    const User = await user.findOne({ refreshToken });
    jwt.verify(refreshToken, process.env.JWT_KEY, (err, decoded) =>
    {
      if(err || User.id !== decoded.id){
        throw new Error("There is something wrong with the refresh token");
      }
      const accessToken = generateToken(User.id);
      res.json({accessToken});
    });
  
});

//logout
const logout = asyncHandler( async( req, res) => {
  const cookie = req.cookies;
  if(!cookie.refreshToken) throw new Error("No Refresh token");
  const refreshToken = cookie.refreshToken;
  const User = await user.findOne({ refreshToken });
  if(!User){
    res.clearCookie(refreshToken, {
      httpOnly: true,
      secure: true
    });
    res.sendStatus(204);   
  }
  await user.findOneAndUpdate({refreshToken},
    {
      refreshToken: " "
    }); 
  res.clearCookie("refreshToken", {
      httpOnly: true, 
      secure: true
    });
    res.sendStatus(204);  
});

 module.exports =   {
                     createUserCtrl, 
                     userLoginCtrl,
                     userUpdateCtrl,
                     getAllUsersCtrl, 
                     getUserCtrl,
                     deleteUserCtrl,
                     blockUser,
                     unblockUser,
                     refreshTokenHandler,
                     logout
                    }; 