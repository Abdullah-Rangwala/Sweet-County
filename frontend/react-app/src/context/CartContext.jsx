import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(item => item._id === product._id);
            if (existingItem) {
                return prevCart.map(item =>
                    item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(item => item._id === productId);
            if (existingItem && existingItem.quantity > 1) {
                return prevCart.map(item =>
                    item._id === productId ? { ...item, quantity: item.quantity - 1 } : item
                );
            }
            return prevCart.filter(item => item._id !== productId);
        });
    };

    const deleteFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter(item => item._id !== productId));
    };

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, deleteFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};