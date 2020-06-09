import React, {useState,useEffect} from "react";
import { useParams } from "react-router-dom";
import Loader from "react-loader-spinner";
import Modal from "react-modal";

import PlaceList from "../components/PlaceList";
import {
  CustomStylesSpinner,
  CustomStylesError,
} from "../../shared/components/CustomStyles";

// import {DUMMY_PLACES} from '../../data';

const UserPlaces = () => {
  const userId = useParams().uid;
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState();
  const [loadedPlaces, setLoadedPlaces] = useState(null);

  // const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === +userId);

  useEffect(() => {
    const fetchPlaces = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/places/user/${userId}`);

        console.log('resp:', response);
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        console.log(responseData.places);

        setLoadedPlaces(responseData.places);
      } catch (err) {
        // console.log(err);
        setIsError(true);
        setError(err.message);
      }

      setIsLoading(false);
    };
    fetchPlaces();
  }, []);

  return (
    <div>
      <PlaceList places={loadedPlaces} />
    </div>
  );
};

export default UserPlaces;
