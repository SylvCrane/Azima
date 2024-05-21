import React, { createContext, useContext, useState, useEffect } from 'react';
//import AccountLogo from '../assets/AzimaAccountLogo.svg';

const initialUser = {
    email: '',
    firstName: '',
    lastName: '',
    company: '',
    bio: '',
    location: '',
    profileImage: '',
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

    // Wrapping setUser to update localStorage
    const updateUser = (newUser) => {
        console.log("Updating user with data:", newUser); // Log to see the data being set
        setUser(newUser);
        if (newUser.isAuthenticated) {
            localStorage.setItem("user", JSON.stringify(newUser));
        } else {
            localStorage.removeItem("user");
        }
    };

    return (
        <UserContext.Provider value={[user, updateUser]}>
            {children}
        </UserContext.Provider>
    );
};

const useUser = () => useContext(UserContext);

export { UserProvider, useUser };