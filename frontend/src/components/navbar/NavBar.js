import styles from "../../css/navbar.css";

const NavBar = ({ children }) => {
  return <nav className={styles.navbar}>{children}</nav>;
};

export default NavBar;