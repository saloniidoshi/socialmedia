const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/authMiddleware')
const { userFollowRules, userUnFollowRules, requestActionRules } = require('../validator/userValidator');
const validate  = require('../middlewares/validate');


router.post('/updatePrivacy', auth, userController.updatePrivacy)
router.post('/userFollow', auth, userFollowRules, validate, userController.userFollow)
router.post('/userUnFollow', auth, userUnFollowRules, validate, userController.userUnFollow)
router.post('/followersList', auth, userController.followersList)
router.post('/followingList', auth, userController.followingList)
router.post('/requestList', auth, userController.requestList)
router.post('/requestAction', auth, requestActionRules, validate, userController.requestAction)

module.exports = router