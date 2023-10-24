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
          refreshTokenHandler } = require('../controller/userCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const userRouter = express.Router();

userRouter.post("/register", createUserCtrl);
userRouter.post("/login", userLoginCtrl);
userRouter.get("/get_all_users", getAllUsersCtrl);
userRouter.delete("/:id", deleteUserCtrl);
userRouter.get("/refresh", refreshTokenHandler);
userRouter.get("/:id", authMiddleware, isAdmin, getUserCtrl);
userRouter.put("/edit_user", authMiddleware, userUpdateCtrl);
userRouter.put("/block_user/:id", authMiddleware, isAdmin, blockUser);
userRouter.put("/unblock_user/:id", authMiddleware, isAdmin, unblockUser);

 
module.exports = userRouter;