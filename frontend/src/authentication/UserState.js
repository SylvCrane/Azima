import React, { createContext, useContext, useState, useEffect } from 'react';

const initialUser = {
    email: '',
    password: '',
    isAuthenticated: false,
};

const UserContext = createContext([initialUser, () => {}]);

// State hook for user information, initialized with localStorage data or the default initial state
const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : initialUser;
    });

    // useEffect hook to update localStorage whenever the user state changes
    useEffect(() => {
        if (user.isAuthenticated) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    return (
        <UserContext.Provider value={[user, setUser]}>
            {children}
        </UserContext.Provider>
    );
};

const useUser = () => useContext(UserContext);

export { UserProvider, useUser };