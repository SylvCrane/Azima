import styles from "../../css/navbar.css";

const NavBarDropdown = ({ children }) => {
    return <div className={styles.dropdown_container}>{children}</div>;
  };
  
  export default NavBarDropdown;