import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginService, logout as logoutService, getUserDataFromToken } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Para saber si estamos verificando el token inicial

    useEffect(() => {
        // Al cargar la app, verifica si ya hay un token válido
        const userData = getUserDataFromToken();
        if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const login = async (credentials) => {
        await loginService(credentials);
        const userData = getUserDataFromToken();
        if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
        }
    };

    const logout = () => {
        logoutService();
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => {
    return useContext(AuthContext);
};