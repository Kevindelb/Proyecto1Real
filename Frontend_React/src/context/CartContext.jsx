import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const { token, user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    // obtener los items del carrito de  la base de datos
    const fetchCart = async () => {
        if (!token) {
            setCartItems([]);
            setCartTotal(0);
            return;
        }
        setLoading(true);
        try {
            const response = await api.get('/carrito');
            // response.data tiene { items: [...], total: ... }
            setCartItems(response.data.items || []);
            setCartTotal(response.data.total || 0);
        } catch (error) {
            console.error('Error al cargar el carrito:', error);
        } finally {
            setLoading(false);
        }
    };

    //  carga el carrito automaticamente cuando el token cambia
    useEffect(() => {
        fetchCart();
    }, [token]);

    //  agrega un item al carrito
    const addToCart = async (id_servicio, cantidad = 1, fecha_viaje = null, num_personas = 1, observaciones = '') => {
        if (!token) {
            return { success: false, requireLogin: true };
        }

        try {
            //  establece la fecha predeterminada para el viaje si no se proporciona (mañana, ya que la validación de laravel dice 'después de hoy')
            let dateToSend = fecha_viaje;
            if (!dateToSend) {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                dateToSend = tomorrow.toISOString().split('T')[0];
            }

            const response = await api.post('/carrito', {
                id_servicio,
                cantidad,
                fecha_viaje: dateToSend,
                num_personas,
                observaciones
            });

            await fetchCart();
            return { success: true, message: response.data.message || 'Servicio agregado al carrito' };
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
            const message = error.response?.data?.message || 'Error al agregar el servicio';
            return { success: false, message };
        }
    };

    //  actualizar cantidad de un item del carrito
    const updateCartItem = async (id_carrito, cantidad, fecha_viaje = null, num_personas = null) => {
        if (!token) return { success: false, requireLogin: true };
        try {
            const data = { cantidad };
            if (fecha_viaje) data.fecha_viaje = fecha_viaje;
            if (num_personas) data.num_personas = num_personas;

            const response = await api.put(`/carrito/${id_carrito}`, data);
            await fetchCart();
            return { success: true, message: response.data.message };
        } catch (error) {
            console.error('Error al actualizar item del carrito:', error);
            return { success: false, message: 'No se pudo actualizar el item' };
        }
    };

    //  remover item del carrito 
    const removeFromCart = async (id_carrito) => {
        if (!token) return { success: false, requireLogin: true };
        try {
            const response = await api.delete(`/carrito/${id_carrito}`);
            await fetchCart();
            return { success: true, message: response.data.message };
        } catch (error) {
            console.error('Error al eliminar item del carrito:', error);
            return { success: false, message: 'No se pudo eliminar el item del carrito' };
        }
    };

    //  limpiar carrito
    const clearCart = async () => {
        if (!token) return { success: false, requireLogin: true };
        try {
            const response = await api.delete('/carrito');
            await fetchCart();
            return { success: true, message: response.data.message };
        } catch (error) {
            console.error('Error al vaciar el carrito:', error);
            return { success: false, message: 'No se pudo vaciar el carrito' };
        }
    };

    // checkout (post /api/pedidos)
    const checkout = async (metodoPago, titular = '', numeroTarjeta = '', referenciaExterna = '') => {
        if (!token) return { success: false, requireLogin: true };
        try {
            const response = await api.post('/pedidos', {
                metodo_pago: metodoPago,
                nombre_titular: titular || null,
                numero_tarjeta: numeroTarjeta || null,
                referencia_externa: referenciaExterna || null
            });
            //  elimina el carrito automaticamente en el backend
            await fetchCart();
            return { success: true, order: response.data.pedido, message: response.data.message };
        } catch (error) {
            console.error('Error al realizar el pedido:', error);
            const message = error.response?.data?.message || 'Error al procesar el pedido';
            return { success: false, message };
        }
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            cartTotal,
            loading,
            fetchCart,
            addToCart,
            updateCartItem,
            removeFromCart,
            clearCart,
            checkout
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe usarse dentro de un CartProvider');
    }
    return context;
}
