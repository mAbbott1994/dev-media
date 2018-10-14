const Validator = require("validator");
const isEmpty = require("./isInputEmpty");

module.exports = validateProfileInput = data => {
  let errors = {};

  const handle = !isEmpty(data.handle) ? data.handle : "";
  const skills = !isEmpty(data.skill) ? data.skills : "";
  const status = !isEmpty(data.status) ? data.status : "";

  if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = "Handle must be between 2 and 40 characters";
  }

  if (!Validator.isEmpty(data.handle)) {
    errors.handle = "Handle field cannot be empty";
  }

  if (!Validator.isEmpty(data.status)) {
    errors.status = "Status field cannot be empty";
  }

  if (!Validator.isEmpty(data.skills)) {
    errors.skills = "Skills field cannot be empty";
  }

  if (!Validator.isEmpty(data.website)) {
    if(!Validator.isURL(data.website)) {
      errors.website = "Not a valid url";
    }
  }
  if (!Validator.isEmpty(data.facebook)) {
    if(!Validator.isURL(data.facebook)) {
      errors.website = "Not a valid url";
    }
  }
  if (!Validator.isEmpty(data.twitter)) {
    if(!Validator.isURL(data.twitter)) {
      errors.website = "Not a valid url";
    }
  }
  if (!Validator.isEmpty(data.instagram)) {
    if(!Validator.isURL(data.instagram)) {
      errors.website = "Not a valid url";
    }
  }
  if (!Validator.isEmpty(data.linkedin)) {
    if(!Validator.isURL(data.linkedin)) {
      errors.website = "Not a valid url";
    }
  }

  return {
    errors, 
    isValid: isEmpty(errors)
  }
};
