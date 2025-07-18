import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginService, logout as logoutService, getUserDataFromToken } from '../services/authService';
import { getMiPerfil } from '../services/usuarioService'; // Importamos el servicio de perfil

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); 
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkLoggedIn = async () => {
            const tokenData = getUserDataFromToken();
            if (tokenData) {
                try {
                    const profileData = await getMiPerfil();
                    setUser(profileData);
                    setIsAuthenticated(true);
                } catch (error) {
                    logoutService();
                }
            }
            setIsLoading(false);
        };
        checkLoggedIn();
    }, []);

    const login = async (credentials) => {
        await loginService(credentials);
        // 3. Después del login, también buscamos el perfil completo
        const profileData = await getMiPerfil();
        setUser(profileData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        logoutService();
        setUser(null);
        setIsAuthenticated(false);
    };
    
    // 4. Creamos una función para refrescar los datos del usuario (ej. después de editar el perfil)
    const refreshUserData = async () => {
        try {
            const profileData = await getMiPerfil();
            setUser(profileData);
        } catch (error) {
            console.error("No se pudo refrescar los datos del usuario", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, refreshUserData }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};