const express = require('express');
const {
          createUserCtrl,
          userLoginCtrl,
          getAllUsersCtrl,
          getUserCtrl,
          deleteUserCtrl,
          userUpdateCtrl,
          blockUser,
          unblockUser,
          refreshTokenHandler,
          logout, 
          updatePassword,
          forgotPasswordToken,
          resetPassword } = require('../controller/userCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const userRouter = express.Router();
//user routes
userRouter.post("/register", createUserCtrl);
userRouter.put("/update-password", authMiddleware, updatePassword);
userRouter.post("/forgot-password-token", forgotPasswordToken);
userRouter.put("/reset-password/:token", resetPassword);
userRouter.post("/login", userLoginCtrl);
userRouter.get("/get_all_users", getAllUsersCtrl);
userRouter.delete("/:id", deleteUserCtrl);
userRouter.get("/refresh", refreshTokenHandler);
userRouter.get("/logout", logout);
userRouter.get("/:id", authMiddleware, isAdmin, getUserCtrl);
userRouter.put("/edit_user", authMiddleware, userUpdateCtrl);
userRouter.put("/block_user/:id", authMiddleware, isAdmin, blockUser);
userRouter.put("/unblock_user/:id", authMiddleware, isAdmin, unblockUser);

 
module.exports = userRouter; 