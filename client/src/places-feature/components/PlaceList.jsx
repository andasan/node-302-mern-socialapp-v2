import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from 'react-redux';

import PlaceItem from "./PlaceItem";

const PlaceList = (props) => {
  const isLoggedIn = useSelector(state => state.isLoggedIn);

  console.log('PLACELIST: ', props);

  if (props.places.places.length === 0) {
    return (
      <div className="row center">
        {isLoggedIn ? (
          <>
            <h4>No Places found. Maybe create one?</h4>
            <NavLink to="/places/new">
              <div className="btn-floating btn-large">
                <i className="material-icons black">add</i>
              </div>
            </NavLink>
          </>
        ) : (
          <h4>No Places found.</h4>
        )}
      </div>
    );
  }

  return (
    <div className="row center">
      {props.places.places.map((place) => (
        <PlaceItem key={place._id} {...place} />
      ))}
    </div>
  );
};

export default PlaceList;
