import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // cargar información del usuario autenticado si hay un token guardado
    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const response = await api.get('/user');
                    setUser(response.data);
                } catch (error) {
                    console.error('Error cargando usuario autenticado:', error);
                    logout();
                }
            }
            setLoading(false);
        };
        loadUser();
    }, [token]);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await api.post('/login', { email, password });
            const { access_token, user: userData } = response.data;
            
            localStorage.setItem('token', access_token);
            api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
            setToken(access_token);
            setUser(userData);
            
            return { success: true, user: userData };
        } catch (error) {
            console.error('Error de inicio de sesión:', error);
            const message = error.response?.data?.message || error.response?.data?.errors?.email?.[0] || 'Error en las credenciales';
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const register = async (nombre, apellidos, email, password, telefono) => {
        setLoading(true);
        try {
            const response = await api.post('/register', {
                nombre,
                apellidos,
                email,
                password,
                telefono
            });
            const { access_token, user: userData } = response.data;
            
            localStorage.setItem('token', access_token);
            api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
            setToken(access_token);
            setUser(userData);
            
            return { success: true, user: userData };
        } catch (error) {
            console.error('Error de registro:', error);
            const message = error.response?.data?.message || 'Error al registrar la cuenta';
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            if (token) {
                await api.post('/logout').catch(() => {}); // si falla o ya venció, igual limpiamos localmente
            }
        } catch (e) {
            console.error(e);
        } finally {
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
            setToken(null);
            setUser(null);
            setLoading(false);
        }
    };

    const isAdmin = () => {
        return user && user.tipo_usuario === 'administrador';
    };

    return (
        <AuthContext.Provider value={{ user, setUser, token, loading, login, register, logout, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
}
