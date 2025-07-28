import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { login as loginService, register as registerService } from '../services/authService';
import api from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('jwt_token'));
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthed, setIsAuthed] = useState(false);

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                // Provera da li je token istekao
                if (decodedToken.exp * 1000 > Date.now()) {
                    // Dohvati detaljne info o korisniku sa /me endpointa
                    api.get('/users/me').then(response => {
                        setUser(response.data);
                        setIsAuthed(true);
                        setIsLoading(false);
                    }).catch(() => {
                        logout();
                    });
                } else {
                    logout(); // Token je istekao
                }
            } catch (error) {
                console.error("Token decode error:", error);
                logout(); // Token je neispravan
            }
        } else {
            setIsLoading(false);
        }
    }, [token]);

    const login = async (credentials) => {
        const response = await loginService(credentials);
        const newToken = response.token;
        localStorage.setItem('jwt_token', newToken);
        setToken(newToken);
        // useEffect će se pobrinuti za postavljanje usera
    };

    const register = async (userData) => {
        return await registerService(userData);
    };

    const logout = () => {
        localStorage.removeItem('jwt_token');
        setUser(null);
        setToken(null);
        setIsAuthed(false);
    };
    
    const value = {
        user,
        token,
        isLoading,
        isAuthed,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{!isLoading && children}</AuthContext.Provider>;
};