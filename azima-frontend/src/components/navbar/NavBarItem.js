import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "../../css/navbar.css";

const NavBarItem = ({ children, to, end, dropdown, onClick, style }) => {
  const navigate = useNavigate();

  const handleNavigate = (event) => {
    if (typeof to === "string") {
      navigate(to);
    }

    if (typeof onClick === "function") {
      onClick();
    }

    event.stopPropagation();
  };

  const handleDropdownClick = (event) => {
    // Stop event propagation to prevent the dropdown from closing immediately
    event.stopPropagation();
  };

  return (
    <div
      style={style}
      className={`${to || onClick ? styles.clickable : styles.navitem}${
        end ? ` ${styles.end}` : ""
      }${dropdown ? ` ${styles.dropdown}` : ""}`}
      onClick={dropdown ? handleDropdownClick : handleNavigate}
    >
      {to ? (
        <NavLink to={to} activeClassName={styles.active}>
          {children}
        </NavLink>
      ) : (
        children
      )}
    </div>
  );
};

export default NavBarItem;