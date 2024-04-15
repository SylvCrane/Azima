import React, { createContext, useContext, useState, useEffect } from 'react';

// Object that represents the initial state of the user.
const initialUser = {
  email: '',
  password: '',
  isAuthenticated: false,
};

/* Passing initialUser object as the default value - if user info 
is not inputted/not found, email and password remain empty and authentication is false.
*/
const UserContext = createContext(initialUser);


const UserProvider = ({ children }) => {
  const [user, setUser] = useState(initialUser); // State variable to handle state of the initial user.

  useEffect(() => {
    const isLoggedIn = window.localStorage.getItem("isLoggedIn") === "true, user authenticated";
    const email = window.localStorage.getItem("userEmail");
    const lastActivityTime = window.localStorage.getItem("lastActivityTime");
    const currentTime = new Date().getTime(); // get current time of the day
    /* Check if the user is logged and their email is valid and if lastActivityTime is not null
      and if the difference between the current time and lastActivityTime is less than or equal to 24 hours.
      - User will be logged out after 24 hrs if inactive.
    */
    if (isLoggedIn && email && lastActivityTime && (currentTime - lastActivityTime <= 24 * 60 * 60 * 1000)) {
      /* If statement above is met/valid user session will be authenticated and 
        will remain authenticated even when user refreshes the page. 
      */
      setUser({
        isAuthenticated: true,
        email: email
      });
    } else {
      /* otherwise, if user is not logged in or authentication is invalid, the
        localStorage keys are removed and the user is not logged in.
      */
      window.localStorage.removeItem("isLoggedIn");
      window.localStorage.removeItem("userEmail");
      window.localStorage.removeItem("lastActivityTime");
      setUser({
        isAuthenticated: false,
        email: undefined,
        password: undefined
      });
    }
  }, []);

  // Extend setUser to update localStorage
  const handleSetUser = (newUser) => {
    if (newUser.isAuthenticated) {
      window.localStorage.setItem("isLoggedIn", "true");
      window.localStorage.setItem("userEmail", newUser.email);
      window.localStorage.setItem("lastActivityTime", new Date().getTime().toString());
    } else {
      window.localStorage.removeItem("isLoggedIn");
      window.localStorage.removeItem("userEmail");
      window.localStorage.removeItem("lastActivityTime");
    }
    setUser(newUser);
  };

  return (
    <UserContext.Provider value={[user, handleSetUser]}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export { UserProvider, useUser };