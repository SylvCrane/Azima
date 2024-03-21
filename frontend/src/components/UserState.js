/* File to check and user authentication - will be used for Populated Navigation bar file */

import React, { createContext, useContext, useState } from 'react';

// Initial user object with default values
const initialUser = {
  email: '', // Assuming email is a string
  isAuthenticated: false,
};

// Create a context with the initial user object
const UserContext = createContext(initialUser);

// UserProvider component
const UserProvider = ({ children }) => {
  // State to manage user object
  const [user, setUser] = useState(initialUser);

  // Wrap children components with the user context provider
  return (
    <UserContext.Provider value={[user, setUser]}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access user context
const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export { UserProvider, useUser };