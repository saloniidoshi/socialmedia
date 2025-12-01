const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const auth = require("../middlewares/authMiddleware");
const {
  createPostRules,
  updatePostRules,
  deletePostRules,
  archivePostRules,
  pinnedPostRules,
  listPostRules,
  getPostRules,
  generateCaptionRules,
} = require("../validator/postValidator");
const validate = require("../middlewares/validate");

router.post(
  "/createPost",
  auth,
  createPostRules,
  validate,
  postController.createPost
);
router.post(
  "/updatePost",
  auth,
  updatePostRules,
  validate,
  postController.updatePost
);
router.post(
  "/deletePost",
  auth,
  deletePostRules,
  validate,
  postController.deletePost
);
router.post(
  "/archivePost",
  auth,
  archivePostRules,
  validate,
  postController.archivePost
);
router.post(
  "/pinnedPost",
  auth,
  pinnedPostRules,
  validate,
  postController.pinnedPost
);
router.get("/listPost",
  auth,
  listPostRules,
  validate,
  postController.listPost
);
router.get("/getPost",
  auth,
  getPostRules,
  validate,
  postController.getPost
);
router.post(
  "/generateCaption",
  auth,
  generateCaptionRules,
  validate,
  postController.generateCaption
);
module.exports = router;
