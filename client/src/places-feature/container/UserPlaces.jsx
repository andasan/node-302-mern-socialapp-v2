import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Loader from "react-loader-spinner";
import Modal from "react-modal";
import { useSelector } from "react-redux";

import PlaceList from "../components/PlaceList";
import {
  CustomStylesSpinner,
  CustomStylesError,
} from "../../shared/components/CustomStyles";
import { useHttpClient } from "../../shared/hooks/HttpHook";

// import {DUMMY_PLACES} from '../../data';

const UserPlaces = () => {
  const userId = useParams().uid;
  const { userPlaces } = useSelector(state => state);
  //   const [isLoading, setIsLoading] = useState(false);
  //   const [error, setError] = useState();
  const [isError, setIsError] = useState(false);
  const [loadedPlaces, setLoadedPlaces] = useState(null);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  // const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === +userId);

  useEffect(() => {
    const fetchPlaces = async () => {
      //   setIsLoading(true);
      //   try {
      //       const response = await fetch(`http://localhost:5000/api/places/user/${userId}`);

      //       const responseData = await response.json();

      //       if (!response.ok) {
      //           throw new Error(responseData.message);
      //         }

      //         console.log('resp:', responseData.places);
      //     setLoadedPlaces(responseData.places);
      //   } catch (err) {
      //     // console.log(err);
      //     setIsError(true);
      //     setError(err.message);
      //   }

      //   setIsLoading(false);
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/user/${userId}`
        );
        setLoadedPlaces(responseData.userWithPlaces);
      } catch (err) {
        setIsError(true);
      }
    };
    fetchPlaces();
  }, [sendRequest, userId, userPlaces]);

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

      {!isLoading && loadedPlaces && <PlaceList placesList={loadedPlaces} />}
    </>
  );
};

export default UserPlaces;
