const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middlewares/authMiddleware");
const { registerRules, loginRules } = require("../validator/authValidator");
const validate = require("../middlewares/validate");

router.post("/register", registerRules, validate, authController.register);
router.post("/login", loginRules, validate, authController.login);
router.get("/me", auth, authController.me);
router.post("/logout", auth, authController.logout);
router.post("/deleteAccount", auth, authController.deleteAccount);

module.exports = router;
