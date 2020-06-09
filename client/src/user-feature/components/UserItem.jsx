import React from "react";
// import { DUMMY_PLACES } from "../../data";

const UserItem = (props) => {

  // const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === +props.id);
  // const numPlaces = (loadedPlaces.length === 0) ? 0 : loadedPlaces.length;

  return (
    <div className="card white darken-1 hoverable collection">
      <div className="card-content black-text collection-item avatar">
        <img src={props.image} alt="" className="circle" />
        <span className="card-title">{props.username}</span>
        <p className="card-places">{props.places.length} {props.places.length <= 1 ? 'Place':'Places'}</p>
      </div>
    </div>
  );
};

export default UserItem;
