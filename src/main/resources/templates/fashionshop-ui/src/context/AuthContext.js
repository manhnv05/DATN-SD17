import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

export const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    return (
        <AuthContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};