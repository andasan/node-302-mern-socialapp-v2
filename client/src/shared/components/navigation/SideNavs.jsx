import React from "react";
import { SideNavItem, Button, Icon } from "react-materialize";
import { useSelector, useDispatch } from "react-redux";

const SideNavs = () => {
  const {isLoggedIn ,userId} = useSelector((state) => state);
  const dispatch = useDispatch();

  return (
    <>
      <SideNavItem
        user={{
          background: "https://images.pexels.com/photos/57416/cat-sweet-kitty-animals-57416.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
          email: "tsuma@gmail.com",
          image: "https://images.unsplash.com/photo-1520315342629-6ea920342047?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80",
          name: "Maki Zushi",
        }}
        userView
      />
      <SideNavItem href="/">Feed</SideNavItem>
      {isLoggedIn && <SideNavItem href={`/${userId}/places`}>My Places</SideNavItem>}
      {isLoggedIn && <SideNavItem href="/places/new">Add a Place</SideNavItem>}
      <SideNavItem divider />
      {!isLoggedIn && <SideNavItem href="/auth">Auth</SideNavItem>}
      {isLoggedIn && (
        <>
          <div className="row center"></div>
          <div className="row center">
            <Button
              node="button"
              style={{
                backgroundColor: "#bf360c",
                color: "#fff"
              }}
              onClick={() => {
                dispatch({ type: "LOGOUT" });
              }}
            >
              Logout
              <Icon right>exit_to_app</Icon>
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default SideNavs;
