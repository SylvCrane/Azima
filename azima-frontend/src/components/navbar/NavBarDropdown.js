import styles from "../../css/navbar.css";

const NavBarDropdown = ({ children }) => {
    return <div className={styles.dropdown}>{children}</div>;
  };
  
  export default NavBarDropdown;