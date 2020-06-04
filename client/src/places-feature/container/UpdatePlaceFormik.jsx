import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";
import TextareaAutosize from "react-textarea-autosize";

import { DUMMY_PLACES } from "../../data";
import Input from "../../shared/components/Input";

const CustomTextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  if (props.type === "text") {
    return (
      <div className="input-field col s12">
        <input {...field} {...props} />
        <label className="white-text active" htmlFor={props.id || props.name}>
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
        <label className="white-text active" htmlFor={props.id || props.name}>
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
      <TextareaAutosize
        className="materialize-textarea"
        {...field}
        {...props}
      />
      <label className="white-text active" htmlFor={props.id || props.name}>
        {label}
      </label>
      {meta.touched && meta.error ? (
        <span className="helper-text" data-error={meta.error}>
          {meta.error}
        </span>
      ) : null}
    </div>
  );
};

const UpdatePlaceFormik = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState({
    title: "",
    description: "",
    address: "",
  });

  const placeId = useParams().pid;
  const identifiedPlace = DUMMY_PLACES.find((place) => place.id === +placeId);

  useEffect(() => {
    if (identifiedPlace) {
      setState({
        title: identifiedPlace.title,
        description: identifiedPlace.description,
        address: identifiedPlace.address,
      });
    }
    setIsLoading(false);
  }, [identifiedPlace]);

  if (!identifiedPlace) {
    return (
      <div className="row center">
        <h2>Could not find place!</h2>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="row center">
        <p>Loading....</p>
      </div>
    );
  }

  return (
    <div>
      <Formik
        initialValues={state}
        validationSchema={}
        onSubmit={(values, { isSubmitting, resetForm }) => {
          //async api post call here
          //submit code hes
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            isSubmitting(false);
            resetForm();
          }, 500);
        }}
      >
        {(props) => {
          return (
            <Form>
              <h1>Edit a Place</h1>
              <CustomTextInput label="Title" name="title" type="text" />
              <CustomTextInput
                label="Description"
                name="description"
                type="textarea"
              />
              <CustomTextInput label="Address" name="address" type="text" />
              <button
                className="waves-effect waves-light btn white-text green darken-4"
                type="submit"
                disabled={!!props.isSubmitting}
              >
                {props.isSubmitting ? "Loading..." : "Submit"}
                <i className="material-icons right">send</i>
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default UpdatePlaceFormik;
