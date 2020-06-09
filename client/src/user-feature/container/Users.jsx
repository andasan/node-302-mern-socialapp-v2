import React, { useState, useEffect } from "react";
import Loader from "react-loader-spinner";
import Modal from "react-modal";

import UsersList from "../components/UsersList";
import {
  CustomStylesSpinner,
  CustomStylesError,
} from "../../shared/components/CustomStyles";
// import { DUMMY_USERS } from "../../data";

const Users = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState();
  const [loadedUsers, setLoadedUsers] = useState(null);

  useEffect(() => {
    const sendRequest = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/users/");
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setLoadedUsers(responseData.users);
      } catch (err) {
        // console.log(err);
        setIsError(true);
        setError(err.message);
      }

      setIsLoading(false);
    };
    sendRequest();
  }, []);

  const errorHandler = () => {
    setError(null);
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

      <div className="container">
        {!isLoading && loadedUsers && <UsersList items={loadedUsers} /> }
      </div>
    </>
  );
};

export default Users;
