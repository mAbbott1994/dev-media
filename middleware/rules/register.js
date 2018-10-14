const Validator = require("validator");
const isEmpty = require("./isInputEmpty");

module.exports = function validateRegInput(data) {
  let errors = {};

  /**
   * Force input fields to be string before using validator as it only accepts string types
   */
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.confimationPassword = !isEmpty(data.confimationPassword)
    ? data.confimationPassword
    : "";

  if (!Validator.isLength(data.name, { min: 4, max: 30 })) {
    errors.name = "name must be between 4 and 40 characters";
  }
  if (!Validator.isLength(data.password, { min: 6, max: 22 })) {
    errors.password = "Password must be between 6 and 22 characters";
  }
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }
  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
  if (Validator.isEmpty(data.confimationPassword)) {
    errors.confimationPassword = "Confimation password field is required";
  }

  if (!Validator.equals(data.password, data.confimationPassword)) {
    errors.confimationPassword = "Passwords must match";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
