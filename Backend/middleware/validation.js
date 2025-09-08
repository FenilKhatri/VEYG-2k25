const { body, validationResult } = require('express-validator');
const { errorResponse } = require('../utils/response');


// Middleware to validate request based on validation type
const validate = (type) => {
  const rules = validationRules[type];
  if (!rules) {
    throw new Error(`No validation rules found for type: ${type}`);
  }

  return [
    ...rules,
    (req, res, next) => {
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }
      
      // Format errors as an array of error messages
      const errorMessages = errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }));
      
      return errorResponse(res, 400, 'Validation failed', errorMessages);
    }
  ];
};

module.exports = {
  validate,
  validationRules
};
