const { body } = require("express-validator");

(exports.createPostRules = [
  body("content").notEmpty().withMessage("Post content is required"),
]),
  (exports.updatePostRules = [
    body("postId").notEmpty().withMessage("PostId is required"),
    body("content").notEmpty().withMessage("Post content is required"),
  ]),
  (exports.deletePostRules = [
    body("postId").notEmpty().withMessage("PostId is required"),
  ]);
 (exports.archivePostRules = [
    body("postId").notEmpty().withMessage("PostId is required"),
  ]);
   (exports.pinnedPostRules = [
    body("postId").notEmpty().withMessage("PostId is required"),
  ]);