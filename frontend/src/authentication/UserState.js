import React, { createContext, useContext, useState, useEffect } from 'react';

const initialUser = {
    email: '',
    password: '',
    isAuthenticated: false,
};

const UserContext = createContext([initialUser, () => {}]);

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : initialUser;
    });

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