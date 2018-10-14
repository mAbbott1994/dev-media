const Validator = require("validator");
const isEmpty = require("./isInputEmpty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  /**
   * Force input fields to be string before using validator as it only accepts string types
   */
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }
  if (!Validator.isLength(data.password, { min: 6, max: 22 })) {
    errors.password = "Password must be between 6 and 22 characters";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
