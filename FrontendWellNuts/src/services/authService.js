import apiClient from './api';

export const login = async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    // Si el login es exitoso, guardamos el token en localStorage
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

export const register = async (userData) => {
    return await apiClient.post('/auth/register', userData);
};

export const logout = () => {
    localStorage.removeItem('token');
};

export const getUserDataFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        // El payload de un JWT está en la segunda parte, codificado en Base64
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = atob(payloadBase64); // atob decodifica Base64
        const decodedJson = JSON.parse(decodedPayload);
        return decodedJson.usuario; // Devolvemos el objeto { id, rol }
    } catch (error) {
        console.error("Error al decodificar el token:", error);
        return null;
    }
};