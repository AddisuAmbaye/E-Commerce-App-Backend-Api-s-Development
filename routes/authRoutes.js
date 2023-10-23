const express = require('express');
const createUser = require('../controller/userCtrl');
const userRouter = express.Router();

userRouter.post("/register", createUser);

module.exports = userRouter;