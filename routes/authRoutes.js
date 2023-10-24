const express = require('express');
const {
          createUserCtrl,
          userLoginCtrl,
          getAllUsersCtrl,
          getUserCtrl,
          deleteUserCtrl,
          userUpdateCtrl } = require('../controller/userCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const userRouter = express.Router();

userRouter.post("/register", createUserCtrl);
userRouter.post("/login", userLoginCtrl);
userRouter.get("/get_all_users", getAllUsersCtrl);
userRouter.get("/:id", authMiddleware, isAdmin, getUserCtrl);
userRouter.delete("/:id", deleteUserCtrl);
userRouter.put("/edit_user", authMiddleware, userUpdateCtrl);

module.exports = userRouter;