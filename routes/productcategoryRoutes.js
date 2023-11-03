const express = require("express");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getallCategory,
} = require("../controller/prodcategoryCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const categoryRouter = express.Router();

categoryRouter.post("/", authMiddleware, isAdmin, createCategory);
categoryRouter.put("/:id", authMiddleware, isAdmin, updateCategory);
categoryRouter.delete("/:id", authMiddleware, isAdmin, deleteCategory);
categoryRouter.get("/:id", getCategory);
categoryRouter.get("/", getallCategory);

module.exports = categoryRouter;