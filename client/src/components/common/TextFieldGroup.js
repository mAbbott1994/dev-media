import React from "react";
import classnames from "classnames";
import propTypes from "prop-types";

const TextFieldGroup = ({
  name,
  placeholder,
  value,
  label,
  errors,
  info,
  type,
  onChange,
  disabled
}) => {
  return (
    <div>
      <div className="form-group">
        <input
          type={type}
          className={classnames("form-control form-control-lg", {
            "is-invalid": { errors }
          })}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
        {info && <small className="form-text text-muted">{info}</small>}
        {errors && <div className="invalid-feedback">{errors}</div>}
      </div>
    </div>
  );
};

TextFieldGroup.propTypes = {
  name: propTypes.string.isRequired,
  placeholder: propTypes.string,
  value: propTypes.string.isRequired,
  info: propTypes.string,
  error: propTypes.string,
  type: propTypes.string.isRequired,
  onChange: propTypes.func.isRequired,
  disabled: propTypes.string
};

TextFieldGroup.defaultProps = {
  type: "text"
};
export default TextFieldGroup;
