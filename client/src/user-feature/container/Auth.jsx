import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import Loader from "react-loader-spinner";
import Modal from "react-modal";

import CustomTextInput from "../../shared/components/CustomTextInput";
import {
  CustomStylesSpinner,
  CustomStylesError,
} from "../../shared/components/CustomStyles";
import { useHttpClient } from "../../shared/hooks/HttpHook";

const Auth = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();
  const [isError, setIsError] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const dispatch = useDispatch();

  const switchModeHandler = () => {
    setIsLoginMode((prevMode) => !prevMode);
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .concat(
        !isLoginMode ? Yup.string().required("Username is required") : null
      )
      .min(3, "Must be at least 3 characters long"),
    email: Yup.string().email("Email is invalid").required("Email is required"),
    password: Yup.string()
      .min(6, "Password has to be longer than 6 characters!")
      .required("Please Enter your password")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords are not the same!")
      .concat(
        !isLoginMode
          ? Yup.string().required("Password confirmation is required!")
          : null
      ),
  });

  const authSubmitHandler = async (values) => {
    // console.log('from custom handler: ', values);

    if (isLoginMode) {
      try {
        
        const fetchedUser = await sendRequest(
          "http://localhost:5000/api/users/login",
          "POST",
          { "Content-Type": "application/json" },
          JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        );

        // const responseData = await response.json();

        // if (!response.ok) {
        //   throw new Error(responseData.message);
        // }

        // setIsLoading(false);
        // console.log('response: ', fetchedUser );
        dispatch({ type: "LOGIN", payload: fetchedUser.user._id });
      } catch (err) {
        // console.log(err);
        // setIsLoading(false);
        // setError(err.message || "Something went wrong, please try again."); //trigger modal error
        setIsError(true);
      }
    } else {
      // try {
      //   setIsLoading(true);
      //   const response = await fetch("http://localhost:5000/api/users/signup", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({
      //       username: values.username,
      //       email: values.email,
      //       password: values.password,
      //     }),
      //   });

      //   const responseData = await response.json();

      //   if (!response.ok) {
      //     throw new Error(responseData.message);
      //   }

      //   setIsLoading(false);
      //   // console.log('response: ', responseData);
      //   dispatch({ type: "LOGIN" });
      // } catch (err) {
      //   // console.log(err);
      //   setIsLoading(false);
      //   setIsError(true);
      //   setError(err.message || "Something went wrong, please try again."); //trigger modal error
      // }
      
      //refactored signup
      try {
        const fetchedUser = await sendRequest(
          "http://localhost:5000/api/users/signup",
          "POST",
          { "Content-Type": "application/json" },
          JSON.stringify({
            username: values.username,
            email: values.email,
            password: values.password,
          })
        );

        dispatch({ type: "LOGIN", payload: fetchedUser.user._id });
      } catch (err) {
        setIsError(true);
      }
    }
  };

  const errorHandler = () => {
    // setError(null);
    clearError();
    setIsError(false);
  };

  return (
    <>
      <Modal
        isOpen={isError}
        style={CustomStylesError}
        onRequestClose={errorHandler}
      >
        <div className="modal-header">
          <h3>An error occurred:</h3>
        </div>

        <div className="modal-content">{error}</div>

        <button
          className="waves-effect wave-light btn-small deep-orange-text white right"
          onClick={errorHandler}
        >
          Close
        </button>
      </Modal>

      <Modal isOpen={isLoading} style={CustomStylesSpinner}>
        <Loader
          type="BallTriangle"
          color="#FFF"
          height={200}
          width={200}
          timeout={0}
          visible={isLoading}
        />
      </Modal>

      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm, submitForm }) => {
          setSubmitting(false);
          resetForm();
          submitForm();
          authSubmitHandler(values);
          // dispatch({ type: "LOGIN" });
        }}
      >
        {(props) => {
          return (
            <>
              <div className="row">
                <div className="col s6 offset-s3">
                  <Form>
                    <h1>{isLoginMode ? "Sign In" : "Sign Up"}</h1>
                    {!isLoginMode && (
                      <CustomTextInput
                        label="Username"
                        name="username"
                        type="text"
                      />
                    )}

                    <CustomTextInput label="Email" name="email" type="text" />

                    <CustomTextInput
                      label="Password"
                      name="password"
                      type="password"
                    />
                    {!isLoginMode && (
                      <CustomTextInput
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                      />
                    )}

                    <button
                      className="waves-effect waves-light btn white-text green darken-4"
                      type="submit"
                      disabled={props.isSubmitting}
                    >
                      {props.isSubmitting ? "Loading..." : "Submit"}
                      <i className="material-icons right">send</i>
                    </button>
                  </Form>
                </div>
              </div>
              <div className="divider row"></div>
              <div className="col s6 offset-s3 center white-text">
                {isLoginMode
                  ? "Don't have an account yet? "
                  : "Already have an account? "}
                <button
                  className="waves-effect waves-light btn-small deep-orange-text white accent-2 center"
                  type="reset"
                  onClick={() => {
                    switchModeHandler();
                    props.resetForm();
                  }}
                >
                  Switch to {isLoginMode ? "Sign Up" : "Sign In"}
                </button>
              </div>
            </>
          );
        }}
      </Formik>
    </>
  );
};

export default Auth;
