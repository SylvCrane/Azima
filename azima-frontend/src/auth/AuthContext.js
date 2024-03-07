/* File that handles createContext function which is acts as the global state of the application 
to check whether the user is logged in or not.
*/

/*import { createContext, useReducer } from 'react';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'login':
            return { user: action.payload }
        case 'logout':
            return { user: null }
        default:
            return state;
    }
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null
    })

    console.log("AuthContext state: ,", state)
}*/

