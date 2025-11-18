const { body } = require('express-validator')

exports.userFollowRules = [
  body('followingId')
    .notEmpty().withMessage('followingId is required.')
    .isMongoId().withMessage('followingId must be a valid MongoDB id.'),
];
exports.userUnFollowRules = [
  body('followingId')
    .notEmpty().withMessage('followingId is required.')
    .isMongoId().withMessage('followingId must be a valid MongoDB id.'),
];
exports.requestActionRules = [
  body('followingId')
    .notEmpty().withMessage('followingId is required.')
    .isMongoId().withMessage('followingId must be a valid MongoDB id.'),
body('status')
    .notEmpty().withMessage('status is a required field')
    .isIn(['pending', 'accepted', 'rejected'])
    .withMessage('status must be one of: pending, accepted, or rejected')
]
