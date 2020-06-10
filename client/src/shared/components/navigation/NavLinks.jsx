import React from "react";
import { Dropdown, Button, Divider, Icon } from "react-materialize";
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
          <Dropdown
            id="Dropdown_6"
            trigger={<Button style={{backgroundColor: "#ffcc80",color: "#424242"}}node="button">User</Button>}
          >
            <NavLink to="/">Me</NavLink>
            <Divider />
            {/* <button onClick={()=>{dispatch({type: 'LOGOUT'})}}>Logout</button> */}
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
              <Icon right>exit_to_app</Icon>
            </Button>
          </Dropdown>
        </li>
      )}
    </>
  );
};

export default NavLinks;
