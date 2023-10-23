const express = require('express');
const {createUserCtrl, userLoginCtrl} = require('../controller/userCtrl');
const userRouter = express.Router();

userRouter.post("/register", createUserCtrl);
userRouter.post("/login", userLoginCtrl);

module.exports = userRouter;