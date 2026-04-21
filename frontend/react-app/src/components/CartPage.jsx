import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const CartPage = () => {
    const { cart, addToCart, removeFromCart, deleteFromCart, clearCart } = useContext(CartContext);
    const navigate = useNavigate();

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="discovery-section" style={{ maxWidth: '800px', minHeight: '60vh' }}>
            <h2>Your Cart</h2>
           
            {cart.length === 0 ? (
                <div>
                    <p style={{ marginBottom: '20px', fontSize: '1.1rem' }}>Your cart is looking a bit empty.</p>
                    <Link to="/store" className="cta-btn" style={{ textDecoration: 'none' }}>Go Back to Menu</Link>
                </div>
            ) : (
                <div className="cart-container" style={{ background: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.06)' }}>
                    {cart.map(item => (
                        <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>{item.name}</h3>
                                <p style={{ color: '#7a635c' }}>₹{item.price} x {item.quantity}</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <button
                                        onClick={() => removeFromCart(item._id)}
                                        style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #a36b4f', background: 'transparent', color: '#a36b4f', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}
                                    >−</button>
                                    <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                    <button
                                        onClick={() => addToCart(item)}
                                        style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #a36b4f', background: 'transparent', color: '#a36b4f', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}
                                    >+</button>
                                </div>
                                <h4 style={{ color: '#a36b4f', fontSize: '1.2rem', minWidth: '70px', textAlign: 'right' }}>
                                    ₹{item.price * item.quantity}
                                </h4>
                                <button
                                    onClick={() => deleteFromCart(item._id)}
                                    style={{ background: 'none', border: 'none', color: '#cc4444', cursor: 'pointer', fontSize: '1.2rem' }}
                                    title="Remove item"
                                >🗑️</button>
                            </div>
                        </div>
                    ))}
                    <div style={{ textAlign: 'right', marginTop: '30px' }}>
                        <h2 style={{ marginBottom: '20px' }}>Total: ₹{totalAmount}</h2>
                        <button className="cta-btn" onClick={() => navigate('/payment')}>
                            Proceed to Payment →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;