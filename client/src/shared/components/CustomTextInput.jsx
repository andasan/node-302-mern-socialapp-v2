import React from "react";
import TextareaAutosize from 'react-textarea-autosize';
import { useField } from "formik";

const CustomTextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  if (props.type === "text") {
    return (
      <div className="input-field col s12">
        <input {...field} {...props} />
        <label className="white-text active" htmlFor={props._id || props.name}>
          {label}
        </label>
        {meta.touched && meta.error ? (
          <span className="helper-text" data-error={meta.error}>
            {meta.error}
          </span>
        ) : null}
      </div>
    );
  } else if (props.type === "password") {
    return (
      <div className="input-field col s12">
        <input {...field} {...props} />
        <label className="white-text active" htmlFor={props._id || props.name}>
          {label}
        </label>
        {meta.touched && meta.error ? (
          <span className="helper-text" data-error={meta.error}>
            {meta.error}
          </span>
        ) : null}
      </div>
    );
  }
  return (
    <div className="input-field col s12">
      <TextareaAutosize className="materialize-textarea" {...field} {...props} id="text-area" />
      <label className="white-text active" htmlFor={props._id || props.name}>
        {label}
      </label>
      {meta.touched && meta.error ? (
        <div className="meta-error">{meta.error}</div>
      ) : null}
    </div>
  );
};


export default CustomTextInput;
