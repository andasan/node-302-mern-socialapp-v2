import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Loader from "react-loader-spinner";
import Modal from "react-modal";
import { useSelector } from "react-redux";
// import TextareaAutosize from "react-textarea-autosize";

import CustomTextInput from "../../shared/components/CustomTextInput";
import {
  CustomStylesSpinner,
  CustomStylesError,
} from "../../shared/components/CustomStyles";
import { useHttpClient } from "../../shared/hooks/HttpHook";

// import { DUMMY_PLACES } from "../../data";

const UpdatePlaceFormik = () => {
  // const [isLoading, setIsLoading] = useState(true);
  // const [state, setState] = useState({
  //   title: "",
  //   description: "",
  //   address: "",
  // });
  const [isError, setIsError] = useState(false);
  const [loadedPlace, setLoadedPlace] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const userId = useSelector(state => state.userId);

  const placeId = useParams().pid;
  const history = useHistory();
  // const identifiedPlace = DUMMY_PLACES.find((place) => place.id === +placeId);

  useEffect(() => {
    // if (identifiedPlace) {
    //   setState({
    //     title: identifiedPlace.title,
    //     description: identifiedPlace.description,
    //     address: identifiedPlace.address,
    //   });
    // }
    // setIsLoading(false);

    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/${placeId}`
        );
        setLoadedPlace(responseData.place);
      } catch (err) {
        setIsError(true);
      }
    };
    fetchPlace();
  }, [sendRequest, placeId]);

  const placeUpdateSubmitHandler = async (e, values) => {
    e.preventDefault();
    try{
      await sendRequest(
        `http://localhost:5000/api/places/${placeId}`, 
        "PATCH", 
        {"Content-Type": "application/json"}, 
        JSON.stringify({
          title: values.title,
          description: values.description
        })
      );

      history.push(`/${userId}/places`);
    }catch(err){
      setIsError(true);
    }
  };

  if (!loadedPlace && !error) {
    return (
      <div className="row center">
        <h2>Could not find place!</h2>
      </div>
    );
  }

  if (isLoading) {
    return (
      // <div className="row center">
      //   <p>Loading....</p>
      // </div>
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
    );
  }

  const validationSchema = Yup.object({
    title: Yup.string()
      .min(3, "Must be more than 3 characters")
      .required("A title is require"),
    description: Yup.string().required("A description is required"),
    address: Yup.string().required("An address is required"),
  });

  const errorHandler = () => {
    clearError();
    setIsError(false);
  };

  return (
    <div>
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

      <Formik
        initialValues={loadedPlace}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          //async api post call here
          //submit code hes
          // setTimeout(() => {
          //   alert(JSON.stringify(values, null, 2));
          //   resetForm();
          //   setSubmitting(false);
          // }, 500);
          resetForm();
          setSubmitting(false);
        }}
      >
        {(props) => {
          return (
            <div className="row">
              <div className="col s6 offset-s3">
                <Form onSubmit={(e) => placeUpdateSubmitHandler(e, props.values) }>
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
              </div>
            </div>
          );
        }}
      </Formik>
    </div>
  );
};

export default UpdatePlaceFormik;
