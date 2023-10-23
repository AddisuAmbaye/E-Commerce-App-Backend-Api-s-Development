const express = require('express');
const {
          createUserCtrl,
          userLoginCtrl,
          getAllUsersCtrl,
          getUserCtrl,
          deleteUserCtrl,
          userUpdateCtrl } = require('../controller/userCtrl');
const userRouter = express.Router();

userRouter.post("/register", createUserCtrl);
userRouter.post("/login", userLoginCtrl);
userRouter.get("/get_all_users", getAllUsersCtrl);
userRouter.get("/:id", getUserCtrl);
userRouter.delete("/:id", deleteUserCtrl);
userRouter.put("/:id", userUpdateCtrl);

module.exports = userRouter;