const user = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const generateToken = require('../config/generateToken');
const generateRefershToken = require('../config/refreshToken');
const cookie = require('cookie-parser');
const jwt = require('jsonwebtoken');
const validateMongoDbId = require('../utils/validateMongodbId');
const sendEmail = require('./emailCtrl');
const crypto = require('crypto');

//create user
const createUserCtrl = asyncHandler(
    async (req, res) => {
        const email = req.body.email;
        const UserFound = await user.findOne({email});
        if(!UserFound){
           const newUser = await user.create(req.body);
           res.json(newUser);
          
        }else{ 
           throw new Error('User already exists.');
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

  //update password
  const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { password } = req.body;
    validateMongoDbId(_id);
    const User = await user.findById(_id);
    if (password) {
      User.password = password;
      const updatedPassword = await User.save();
      res.json(updatedPassword);
    } else {
      res.json(user);
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
  const id = req.params.id;
  validateMongoDbId(id);
   try{
      const User = await user.findById(id);
      res.json(User)
   }
   catch(error){
      throw new Error("user not found")
   } 
});

//delete user
const deleteUserCtrl = asyncHandler(async (req, res) => {
  try {
    const userToDelete = await user.findById(req.params.id);

    if (!userToDelete) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    await user.findByIdAndDelete(req.params.id);

    res.json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    throw new Error("Failed to delete user");
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
       req.user.id,
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

    const id = req.params.id;
    validateMongoDbId(id);
    try {
       await user.findByIdAndUpdate(id, 
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
  const id = req.params.id;
  validateMongoDbId(id);
  try {
     await user.findByIdAndUpdate(id, 
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

// forgot password
const forgotPasswordToken = asyncHandler(async(req, res) => {
  const email = req.body.email;
  const User = await user.findOne({email});
  if(!User) throw new Error("User not found");
  try {
    const token = await User.createPasswordResetToken();
    await User.save();
    resetUrl = `Hello👋, Please follow this link to reset your password. This link is valid till 30 minutes form now. <a href = "http://localhost:3000/api/user/reset-password/${token}">Click Here!</a>`;
    const data = {
      to: email,
      text: 'Hello User',
      subject: 'Forgot password Link',
      html: resetUrl
    };
    sendEmail(data)
    res.json({token});
     
  } catch (error) { 
    throw new Error(error);
  } 
 
});

//reset password
const resetPassword = asyncHandler(async(req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const User = await user.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
  });
  if (!User) throw new Error("Token Expired, Please try again later");
      User.password = password;
      User.passwordResetToken = undefined;
      User.passwordResetExpires = undefined;
      await User.save();
      res.json(User);
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
                     logout,
                     updatePassword,
                     forgotPasswordToken,
                     resetPassword
                    }; 