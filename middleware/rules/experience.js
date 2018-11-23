const Validator = require("validator");
const isEmpty = require("./isInputEmpty");

module.exports = function validateExperienceInput(data) {
	let errors = {};
	/**
	 * Force input fields to be string before using validator as it only accepts string types
	 */
	data.title = !isEmpty(data.title) ? data.title : "";
	data.company = !isEmpty(data.company) ? data.company : "";
	data.from = !isEmpty(data.from) ? data.from : "";

	if (Validator.isEmpty(data.title)) {
		errors.title = "Job title field is required";
	}

	if (Validator.isEmpty(data.company)) {
		errors.company = "Company field is required";
	}
	if (Validator.isEmpty(data.from)) {
		errors.from = "from field is required";
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
};
