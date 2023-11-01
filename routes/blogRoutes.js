const express = require("express");
const {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlogs,
  deleteBlog,
  liketheBlog,
  disliketheBlog,
  uploadImages,
} = require("../controller/blogCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { blogImgResize, uploadPhoto } = require("../middlewares/uploadImage");
const blogRouter = express.Router();

blogRouter.post("/", authMiddleware, isAdmin, createBlog);
blogRouter.put(
  "/upload/:id",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 2),
  blogImgResize,
  uploadImages
);
blogRouter.put("/likes", authMiddleware, liketheBlog);
blogRouter.put("/dislikes", authMiddleware, disliketheBlog);

blogRouter.put("/:id", authMiddleware, isAdmin, updateBlog);

blogRouter.get("/:id", getBlog);
blogRouter.get("/", getAllBlogs);

blogRouter.delete("/:id", authMiddleware, isAdmin, deleteBlog);

module.exports = blogRouter;