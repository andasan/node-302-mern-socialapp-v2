import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Modal from "react-modal";
import Loader from "react-loader-spinner";
import { useSelector, useDispatch } from 'react-redux';

import Map from "../../shared/components/Map";
import {
  CustomStylesSpinner,
  CustomStylesError,
  CustomStylesMap,
  CustomStylesConfirm
} from "../../shared/components/CustomStyles";
import { useHttpClient } from "../../shared/hooks/HttpHook";


const PlaceItem = (props) => {
  const [isError, setIsError] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [showMap, setShowMap] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const history = useHistory();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.isLoggedIn);

  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);

  const openDeleteHandler = () => setShowConfirm(true);
  const closeDeleteHandler = () => setShowConfirm(false);

  const editHandler = (id) => {
    history.push(`/places/${id}`);
  };

  const confirmDeleteHandler = async () => {
    // console.log("DELETED");
    setShowConfirm(false);

    try{
      await sendRequest(`http://localhost:5000/api/places/${props._id}`, "DELETE");
      dispatch({ type: "PLACE_DELETED", payload: props._id });
    }catch(err){
      setIsError(true);
    }
  };

  const errorHandler = () => {
    clearError();
    setIsError(false);
  }

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

      <Modal
        isOpen={showMap}
        onRequestClose={closeMapHandler}
        style={CustomStylesMap}
        contentLabel={props.title}
      >
        <Map coords={props.location} />
        <div className="row"></div>
        <div className="modal-footer">
          {props.address}
          <button className="waves-effect waves-light btn-small deep-orange-text white right" onClick={closeMapHandler}>close</button>
        </div>
      </Modal>

      <Modal
        isOpen={showConfirm}
        onRequestClose={closeDeleteHandler}
        style={CustomStylesConfirm}
        contentLabel="Delete a place warning"
      >
        <div className="modal-header"><h1>Are you sure?</h1></div>
        <div className="modal-content">
          You are about to delete a place. Are you sure you want to that?
        </div>
        <div className="row"></div>
        <div className="modal-footer">
          <button className="waves-effect waves-light btn-small deep-orange-text white" onClick={closeDeleteHandler}>Cancel</button>
          <button className="waves-effect waves-light btn-small white-text deep-orange accent-4" onClick={confirmDeleteHandler}>Delete</button>
        </div>
      </Modal>

      <div className="col s6 offset-s3">
        <div className="card">
          <div className="card-image">
            <img src={props.imageUrl} alt="" />
            <span className="card-title">{props.title}</span>
          </div>
          <div className="card-content">
            <p>{props.description}</p>
          </div>
          <div className="card-action">
            <div>
              <i className="material-icons clickable" onClick={openMapHandler}>
                location_on
              </i>
              <span className="card-address" onClick={openMapHandler}>
                {props.address}
              </span>
            </div>
            {isLoggedIn && <div className="card-options">
              <i
                className="material-icons clickable"
                onClick={() => editHandler(props._id)}
              >
                mode_edit
              </i>
              <i
                className="material-icons clickable"
                onClick={openDeleteHandler}
              >
                delete
              </i>
            </div>}
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceItem;
