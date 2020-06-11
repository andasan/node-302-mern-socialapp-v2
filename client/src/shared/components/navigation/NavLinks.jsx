import React from "react";
import { Button } from "react-materialize";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

const NavLinks = (props) => {
  const { isLoggedIn, userId } = useSelector((state) => state);
  const dispatch = useDispatch();

  return (
    <>
      <li>
        <NavLink to="/" exact>
          Feed
        </NavLink>
      </li>
      {isLoggedIn && (
        <li>
          <NavLink to={`/${userId}/places`}>My Places</NavLink>
        </li>
      )}
      {isLoggedIn && (
        <li>
          <NavLink to="/places/new">Add a Place</NavLink>
        </li>
      )}
      {!isLoggedIn && (
        <li>
          <NavLink to="/auth">Auth</NavLink>
        </li>
      )}
      {isLoggedIn && (
        <li>
          <Button
            node="button"
            style={{
              backgroundColor: "#bf360c",
              color: "#fff",
            }}
            onClick={() => {
              dispatch({ type: "LOGOUT" });
            }}
          >
            Logout
          </Button>
        </li>
      )}
    </>
  );
};

export default NavLinks;
