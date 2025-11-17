const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/authMiddleware')


router.post('/updatePrivacy', auth, userController.updatePrivacy)

module.exports = router