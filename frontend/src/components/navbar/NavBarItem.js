import { useNavigate } from "react-router-dom";
import styles from "../../css/navbar.css";

const NavBarItem = ({ children, route, end, dropdown, onClick, style }) => {
  const navigate = useNavigate();

  const handleNavigate = (event) => {
    if (typeof route === "string") {
      navigate(route);
    }

    if (typeof onClick === "function") {
      onClick();
    }

    event.stopPropagation();
  };

  return (
    <div
      style={style}
      className={`${route || onClick ? styles.clickable : styles.navitem}${
        end ? ` ${styles.end}` : ""
      }${dropdown ? ` ${styles.dropdown}` : ""}`}
      onClick={handleNavigate}
    >
      {children}
    </div>
  );
};

export default NavBarItem;