const { validationResult } = require('express-validator');

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = errors.array().map(err => ({ field: err.param, msg: err.msg }));

  return res.status(422).json({
    status: 422,
    data: {},
    message: 'Validation failed.',
    error: extractedErrors,
  });
};
