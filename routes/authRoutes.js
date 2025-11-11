const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middlewares/authMiddleware')

router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/me',auth, authController.me)
router.post('/logout',auth, authController.logout)
router.post('/deleteAccount',auth, authController.deleteAccount)

module.exports = router